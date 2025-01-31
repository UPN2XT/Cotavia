import asyncio
from websockets.asyncio.server import serve # type: ignore
from core.socket import handler
from core.setup import startUp



async def main():
    port = startUp()
    
    print("Starting server on port:", port)
    try:
        async with serve(handler, "", port):
            await asyncio.get_running_loop().create_future()  # run forever
    except:
        if KeyboardInterrupt:
            print("Closing Server")


if __name__ == "__main__":
    asyncio.run(main())
   
