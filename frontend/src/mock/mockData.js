// Mock data for HR Sales Engine Dashboard
export const mockLeads = [
  {
    "user id": "687b5f21e69e7539",
    "name": "Adnan Khan", 
    "gym name": "WTT Exclusive Fitness",
    "phone number": "7351203447",
    "status": "new"
  },
  {
    "user id": "123b5f21e69e7540",
    "name": "Priya Sharma", 
    "gym name": "PowerHouse Gym",
    "phone number": "9876543210",
    "status": "contacted"
  },
  {
    "user id": "456b5f21e69e7541",
    "name": "Rajesh Kumar", 
    "gym name": "Elite Fitness Center",
    "phone number": "8765432109",
    "status": "qualified"
  },
  {
    "user id": "789b5f21e69e7542",
    "name": "Sneha Patel", 
    "gym name": "Gold's Gym",
    "phone number": "7654321098",
    "status": "new"
  },
  {
    "user id": "012b5f21e69e7543",
    "name": "Vikram Singh", 
    "gym name": "Anytime Fitness",
    "phone number": "6543210987",
    "status": "converted"
  },
  {
    "user id": "345b5f21e69e7544",
    "name": "Aisha Rahman", 
    "gym name": "CrossFit Zone",
    "phone number": "5432109876",
    "status": "lost"
  }
];

export const mockStats = {
  totalLeads: 145,
  newLeads: 23,
  qualifiedLeads: 45,
  convertedLeads: 67,
  lostLeads: 10
};

export const mockRecentActivity = [
  {
    id: 1,
    action: "New lead added",
    lead: "Adnan Khan",
    timestamp: "2 minutes ago",
    type: "new"
  },
  {
    id: 2,
    action: "Lead qualified",
    lead: "Priya Sharma", 
    timestamp: "15 minutes ago",
    type: "qualified"
  },
  {
    id: 3,
    action: "Lead converted",
    lead: "Vikram Singh",
    timestamp: "1 hour ago",
    type: "converted"
  }
];