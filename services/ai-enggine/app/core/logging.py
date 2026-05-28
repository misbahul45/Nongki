"""
Setup structured logging menggunakan structlog.
Implementasi detail akan ditambahkan pada tahap berikutnya.
"""

import structlog


def setup_logging() -> None:
    """Configure structlog for the application."""
    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer(),
        ]
    )


logger = structlog.get_logger()
