FROM alpine

WORKDIR /app

RUN echo "read -p 'Press Enter to continue...'" > wait.sh && chmod +x wait.sh

CMD ["sh", "wait.sh"]