export const CAMPUS_LOCATIONS = [
  { id: "all", name: "All Campus Locations" },
  { id: "as_block", name: "Main Block (AS Block)", group: "Academic" },
  { id: "sf_block", name: "Special Format (SF Block)", group: "Academic" },
  { id: "me_block", name: "Mechanical Block (ME Block)", group: "Academic" },
  { id: "ib_block", name: "International Block (IB Block)", group: "Academic" },
  { id: "it_block", name: "IT / CS Labs Block", group: "Academic" },
  { id: "civil_block", name: "Civil & Architecture Block", group: "Academic" },
  { id: "electrical_block", name: "EEE / ECE Labs Block", group: "Academic" },
  { id: "central_library", name: "Central Library & Digital Zone", group: "Facilities" },
  { id: "auditorium", name: "Main Auditorium / Vedanayagam Hall", group: "Facilities" },
  { id: "indoor_stadium", name: "Indoor Stadium / Gym", group: "Facilities" },
  { id: "sports_ground", name: "Main Sports Ground & Track", group: "Facilities" },
  { id: "food_court", name: "Campus Food Court & Canteen", group: "Dining" },
  { id: "student_amenity", name: "Student Amenity Center / Stationery", group: "Facilities" },
  { id: "boys_hostel_1_4", name: "Boys Hostels (BH 1 - 4)", group: "Hostels" },
  { id: "boys_hostel_5_8", name: "Boys Hostels (BH 5 - 8)", group: "Hostels" },
  { id: "girls_hostel_1_3", name: "Girls Hostels (GH 1 - 3)", group: "Hostels" },
  { id: "girls_hostel_4_6", name: "Girls Hostels (GH 4 - 6)", group: "Hostels" },
  { id: "pg_hostel", name: "PG / Scholar Hostels", group: "Hostels" },
  { id: "bus_stand", name: "College Bus Stand & Bay", group: "Transit" },
  { id: "main_gate", name: "Main Security Gate & Reception", group: "Transit" },
  { id: "parking_two_wheeler", name: "Two-Wheeler Student Parking", group: "Transit" },
  { id: "parking_car", name: "Car / Visitor Parking", group: "Transit" },
  { id: "other", name: "Other Campus Location", group: "Other" },
];

export const ITEM_CATEGORIES = [
  { id: "all", name: "All Categories", icon: "layers-outline" },
  { id: "id_card", name: "Student ID / Smart Card", icon: "card-outline" },
  { id: "electronics", name: "Electronics & Gadgets", icon: "laptop-outline" },
  { id: "keys_cycles", name: "Keys & Cycle Locks", icon: "key-outline" },
  { id: "wallet_money", name: "Wallets & Pouches", icon: "wallet-outline" },
  { id: "documents", name: "Lab Records & Books", icon: "book-outline" },
  { id: "clothing", name: "Jackets & Uniforms", icon: "shirt-outline" },
  { id: "accessories", name: "Bottles, Bags & Specs", icon: "briefcase-outline" },
  { id: "others", name: "Other Items", icon: "cube-outline" },
];

export const CUSTODY_OPTIONS = [
  { id: "with_finder", label: "Safe with Finder (I have the item)", icon: "person-outline", desc: "Claimant will reach out to you directly" },
  { id: "main_security_gate", label: "Handed over to Main Security Gate", icon: "shield-checkmark-outline", desc: "Claimant can pick it up at the main campus security office" },
  { id: "dept_office", label: "Submitted to Department HOD / Office", icon: "business-outline", desc: "Item is deposited in the department office" },
  { id: "hostel_warden", label: "Handed over to Hostel Warden / Office", icon: "home-outline", desc: "Item is kept safely with hostel authorities" },
];

export const STATUS_LABELS = {
  active: { label: "Active", color: "#10B981", bg: "#ECFDF5" },
  claimed: { label: "Claimed & Returned", color: "#2563EB", bg: "#EFF6FF" },
  handed_over: { label: "At Security / Admin", color: "#F59E0B", bg: "#FFFBEB" },
  closed: { label: "Closed", color: "#64748B", bg: "#F1F5F9" },
};
