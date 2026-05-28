"""
State definition for whatsapp_customer_agent.
"""
from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
