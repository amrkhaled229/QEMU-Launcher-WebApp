# File: backend/main.py

from __future__ import annotations

import logging
import os
import shlex
import shutil
import subprocess
from pathlib import Path
from typing import Optional

import psutil
from fastapi import APIRouter, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ──────────────────────────── Configuration ────────────────────────────────
API_PREFIX: str = "/api"
FRONTEND_ORIGIN: str = "http://localhost:9002"

ROOT_DIR = Path.cwd()
DISK_DIR = ROOT_DIR / "VMs"
ISO_DIR = ROOT_DIR / "ISOs"
DOCKERFILES_DIR = ROOT_DIR / "dockerfiles"

for _d in (DISK_DIR, ISO_DIR, DOCKERFILES_DIR):
    _d.mkdir(parents=True, exist_ok=True)

DOCKER_BIN: str | None = shutil.which("docker")  

logger = logging.getLogger("containerpilot")
logging.basicConfig(level=logging.INFO)

# ────────────────────────── FastAPI application ────────────────────────────
app = FastAPI(title="ContainerPilot API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
api = APIRouter(prefix=API_PREFIX, tags=["containerpilot"])

# ────────────────────────────── Utilities ──────────────────────────────────
def _run(cmd: list[str]) -> str:
    
    
    if cmd[0] == "docker":
        if DOCKER_BIN is None:
            raise HTTPException(
                status_code=503,
                detail="Docker CLI not found. Install Docker Desktop / Engine and ensure it is on PATH.",
            )
        cmd[0] = DOCKER_BIN

    try:
        res = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False,
        )
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Executable not found: {cmd[0]}",
        ) from exc

    if res.returncode != 0:
        raise HTTPException(
            status_code=500,
            detail=(res.stderr.strip() or "Unknown error while executing " + " ".join(cmd)),
        )

    return res.stdout

# ───────────────────────────── Pydantic models ─────────────────────────────
class DockerfileCreate(BaseModel):
    path: str
    content: str

class ImageBuild(BaseModel):
    dockerfile_path: str
    tag: str
    platform: Optional[str] = None  

class ImageSearch(BaseModel):
    term: str

class PullImage(BaseModel):
    reference: str  # repository[:tag]

class StopContainer(BaseModel):
    container: str  # ID or name

class DiskCreate(BaseModel):
    path: str
    format: str  # qcow2, raw, vdi, vmdk, vhdx, img
    size_gb: int

class VMCreate(BaseModel):
    cpu_cores: int
    memory_mb: int
    disk_path: str
    iso_path: Optional[str] = None
    enable_network: bool = True
    snapshot: bool = False

# ───────────────────────────── Docker endpoints ────────────────────────────
@api.post("/dockerfile", summary="Create a Dockerfile")
def create_dockerfile(req: DockerfileCreate):
    p = Path(req.path).expanduser().resolve()

    # If a directory or missing extension -> default to Dockerfile name
    if p.is_dir() or p.suffix == "":
        p = p / "Dockerfile"

    try:
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(req.content, encoding="utf-8")
    except PermissionError:
        # fallback to safe location
        fallback = DOCKERFILES_DIR / p.name
        fallback.write_text(req.content, encoding="utf-8")
        p = fallback

    return {"message": f"Dockerfile written to {p}"}


@api.post("/docker/build", summary="Build a Docker image")
def build_image(req: ImageBuild):
    # 1) Resolve the Dockerfile path
    dockerfile = Path(req.dockerfile_path).expanduser().resolve()
    if not dockerfile.exists():
        raise HTTPException(400, "Dockerfile not found at path")

    # 2) Read the very first non‐empty, non‐comment line
    first_line = ""
    try:
        with dockerfile.open("r", encoding="utf-8", errors="ignore") as f:
            for ln in f:
                txt = ln.strip()
                if txt and not txt.startswith("#"):
                    first_line = txt.lower()
                    break
    except Exception:
        pass

    # 3) If it looks like a Windows FROM, default to Windows containers
    platform = req.platform
    if "windows" in first_line and not platform:
        platform = "windows/amd64"

    # 4) Build up the docker build command
    cmd: list[str] = ["docker", "build"]
    if platform:
        cmd += ["--platform", platform]
    cmd += [
        "-f", str(dockerfile),
        "-t", req.tag,
        str(dockerfile.parent)
    ]

    # 5) Run and bubble up any errors
    _run(cmd)
    return {"message": f"Built image {req.tag}"}



@api.get("/docker/images", summary="List local Docker images")
def list_images():
    fmt = "{{.Repository}}|{{.Tag}}|{{.ID}}|{{.Size}}"
    stdout = _run(["docker", "images", "--all", "--format", fmt])

    images = []
    for ln in stdout.splitlines():
        repo, tag, img_id, size = ln.split("|", 3)
        images.append({"repository": repo, "tag": tag, "id": img_id, "size": size})

    return {"images": images}


@api.get("/docker/containers", summary="List containers (all)")
def list_containers():
    fmt = "{{.Names}}|{{.Image}}|{{.Status}}|{{.Ports}}|{{.ID}}"
    stdout = _run(["docker", "ps", "--all", "--format", fmt])

    containers = []
    for ln in stdout.splitlines():
        name, image, status, ports, cid = ln.split("|", 4)
        containers.append(
            {"id": cid, "name": name, "image": image, "status": status, "ports": ports}
        )

    return {"containers": containers}


@api.post("/docker/stop", summary="Stop a running container")
def stop_container(req: StopContainer):
    _run(["docker", "stop", req.container])
    return {"message": f"Stopped container {req.container}"}


@api.post("/docker/search", summary="Fuzzy-search local images")
def search_local_images(req: ImageSearch):
    imgs = list_images()["images"]
    term = req.term.lower()   
    return {
        "results": [
            i for i in imgs
            if term in i["repository"].lower()         # match by name
            or term in (i["tag"] or "").lower()        # match by tag
        ]
    }


@api.post("/docker/search_hub", summary="Search Docker Hub")
def search_hub(req: ImageSearch):
    stdout = _run(
        ["docker", "search", req.term, "--format", "{{.Name}}|{{.Description}}"]
    )
    results = []
    for ln in stdout.splitlines():
        name, desc = ln.split("|", 1)
        results.append({"name": name, "description": desc})
    return {"results": results}


@api.post("/docker/pull", summary="Pull an image from Docker Hub")
def pull_image(req: PullImage):
    _run(["docker", "pull", req.reference])
    return {"message": f"Pulled image {req.reference}"}

# ───────────────────────────── Storage helper ───────────────────────────────
@api.get("/storage", summary="Total / free storage in GiB")
def get_storage():
    stat = shutil.disk_usage(DISK_DIR)
    return {
        "total_gb": round(stat.total / 1_073_741_824, 2),
        "free_gb": round(stat.free / 1_073_741_824, 2),
        "used_percent": round(stat.used / stat.total * 100, 1) if stat.total else 0,
    }

# ───────────────────────────── Virtual disks ────────────────────────────────
@api.post("/disks", summary="Create a virtual disk (qemu-img)")
def create_disk(req: DiskCreate):
    p = Path(req.path).expanduser().resolve()
    p.parent.mkdir(parents=True, exist_ok=True)

    driver = "raw" if req.format.lower() == "img" else req.format.lower()
    _run(["qemu-img", "create", "-f", driver, str(p), f"{req.size_gb}G"])

    return {"message": f"Disk created at {p} ({req.format},{req.size_gb}G)"}


@api.get("/disks", summary="List disks in the default folder")
def list_disks():
    disks = []
    for f in DISK_DIR.iterdir():
        if f.is_file():
            disks.append(
                {
                    "path": str(f),
                    "format": f.suffix.lstrip(".").upper(),
                    "size_gb": round(f.stat().st_size / 1_000_000_000, 2),
                }
            )
    return {"disks": disks}


@api.delete("/disks", summary="Delete a disk by full path")
def delete_disk(path: str = Query(...)):
    p = Path(path).expanduser().resolve()
    if not p.exists() or not p.is_file():
        raise HTTPException(404, "Disk not found")
    p.unlink()
    return {"message": f"Deleted disk {p}"}

# ─────────────────────────────── VMs (QEMU) ─────────────────────────────────
@api.post("/vms", summary="Launch VM (detached)")
def launch_vm(req: VMCreate):
    cmd = [
        "qemu-system-x86_64",
        "-smp",
        str(req.cpu_cores),
        "-m",
        str(req.memory_mb),
        "-hda",
        req.disk_path,
    ]
    if req.enable_network:
        cmd += ["-net", "nic", "-net", "user"]
    if req.snapshot:
        cmd.append("-snapshot")
    if req.iso_path:
        cmd += ["-cdrom", req.iso_path, "-boot", "d"]
    else:
        cmd += ["-boot", "c"]

    try:
        subprocess.Popen(cmd)
    except Exception as exc:
        raise HTTPException(500, str(exc)) from exc

    return {"message": "VM launched", "cmd": " ".join(shlex.quote(c) for c in cmd)}


@api.get("/vms", summary="List running QEMU processes")
def list_vms():
    vms = []
    for p in psutil.process_iter(attrs=["pid", "cmdline"]):
        if p.info["cmdline"] and any("qemu-system" in x for x in p.info["cmdline"]):
            vms.append({"pid": p.info["pid"], "cmdline": " ".join(p.info["cmdline"])})
    return {"vms": vms}


@api.delete("/vms", summary="Terminate VM by PID")
def delete_vm(pid: int = Query(...)):
    try:
        psutil.Process(pid).terminate()
    except psutil.NoSuchProcess:
        raise HTTPException(404, "VM not found")
    return {"message": f"Terminated VM process {pid}"}

# ─────────────────────────────── ISOs / browse ─────────────────────────────
@api.get("/isos", summary="List ISO files in the default folder")
def list_isos():
    return {
        "isos": [
            {"name": f.name, "path": str(f)}
            for f in ISO_DIR.glob("*.iso")
            if f.is_file()
        ]
    }


@api.get("/browse", summary="Simple server-side file browser")
def browse(path: str = Query("/")):
    p = Path(path).expanduser().resolve()
    if not p.exists() or not p.is_dir():
        raise HTTPException(404, "Folder not found")

    items = [
        {"name": f.name, "is_dir": f.is_dir()}
        for f in sorted(p.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))
    ]
    return {"current": str(p), "items": items}

# ──────────────────────────────── Mount router ──────────────────────────────
app.include_router(api)

# ───────────────────────────────── Runner ───────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
