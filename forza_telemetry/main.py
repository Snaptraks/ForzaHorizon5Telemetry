import argparse
import logging
import os
import socket
from time import perf_counter

from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS

from constants import BUFFER_SIZE, DEFAULT_PORT
from packet import ForzaDataPacket

logger = logging.getLogger("forza_telemetry")


CLIENT = InfluxDBClient(
    url=os.environ.get("INFLUXDB_URL"),
    token=os.environ.get("INFLUXDB_TOKEN"),
    org=os.environ.get("INFLUXDB_ORG"),
)
WRITE_API = CLIENT.write_api(write_options=SYNCHRONOUS)


def send_data_to_influxdb(data: ForzaDataPacket):
    record = dict(
        measurement="fh5_telemetry",
        fields=data.to_dict(),
    )
    WRITE_API.write(
        bucket=os.environ.get("INFLUXDB_BUCKET"),
        org=os.environ.get("INFLUXDB_ORG"),
        record=record,
    )


def receive_stream(args) -> None:
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.bind(("", args.port))

    print(f"Receiving Forza telemetry to port {args.port}")
    while True:
        t1 = perf_counter()
        message, address = server_socket.recvfrom(BUFFER_SIZE)
        data = ForzaDataPacket(message)
        t2 = perf_counter()

        if args.verbose:
            print(f"Handled frame data in {(t2-t1)*1000:.3f} ms")
            print(data.to_dict())

        send_data_to_influxdb(data)


def main():
    parser = argparse.ArgumentParser(
        description="Receive data from Forza Horizon 5 telemetry."
    )
    parser.add_argument(
        "--port",
        "-p",
        type=int,
        default=DEFAULT_PORT,
        help=f"port this script listens to (Default: {DEFAULT_PORT})",
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="print debugging data to the console",
    )

    args = parser.parse_args()
    receive_stream(args)


if __name__ == "__main__":
    main()
