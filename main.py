import uvicorn

def main():
    print("Starting Mayank Kanth AI Portfolio Backend on http://127.0.0.1:8001 ...")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8001, reload=True)


if __name__ == "__main__":
    main()
