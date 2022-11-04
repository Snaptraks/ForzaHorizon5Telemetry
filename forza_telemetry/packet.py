import struct
from typing import Optional
from constants import FH5_FORMAT, FH5_PROPS


class ForzaDataPacket:
    """Represent a UDP data packet sent from Forza Horizon 5."""

    def __init__(self, packet_data: bytes) -> None:
        data = self.get_data(packet_data)

        # dynamically set class attributes from the UDP datastream
        for key, value in zip(FH5_PROPS, struct.unpack(FH5_FORMAT, data)):
            setattr(self, key, float(value))

    def get_data(self, data: bytes) -> bytes:
        """Remove unknown data from data packets."""

        return data[:232] + data[244:323]

    def to_dict(self, fields: Optional[list[str]] = None) -> dict[str, float]:
        """Convert the data packet to a Python dict."""

        field_names = FH5_PROPS
        if fields:
            field_names = [name for name in fields if name in field_names]

        return {name: getattr(self, name) for name in field_names}
