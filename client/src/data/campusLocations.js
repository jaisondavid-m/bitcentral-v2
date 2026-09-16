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
  { id: "all", name: "All Categories", icon: "Layers" },
  { id: "id_card", name: "Student ID / Smart Card", icon: "CreditCard", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400" },
  { id: "electronics", name: "Electronics & Gadgets", icon: "Laptop", color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400" },
  { id: "keys_cycles", name: "Keys & Cycle Locks", icon: "KeyRound", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400" },
  { id: "wallet_money", name: "Wallets & Pouches", icon: "Wallet", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400" },
  { id: "documents", name: "Lab Records & Books", icon: "BookOpen", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400" },
  { id: "clothing", name: "Jackets & Uniforms", icon: "Shirt", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400" },
  { id: "accessories", name: "Bottles, Bags & Specs", icon: "Backpack", color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/50 dark:text-cyan-400" },
  { id: "others", name: "Other Items", icon: "Package", color: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300" },
];

export const CUSTODY_OPTIONS = [
  { id: "with_finder", label: "Safe with Finder (I have the item)", icon: "UserCheck", desc: "Claimant will reach out to you directly" },
  { id: "main_security_gate", label: "Handed over to Main Security Gate", icon: "ShieldCheck", desc: "Claimant can pick it up at the main campus security office" },
  { id: "dept_office", label: "Submitted to Department HOD / Office", icon: "Building2", desc: "Item is deposited in the department office" },
  { id: "hostel_warden", label: "Handed over to Hostel Warden / Office", icon: "Home", desc: "Item is kept safely with hostel authorities" },
];

export const STATUS_LABELS = {
  active: { label: "Active", bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
  claimed: { label: "Claimed & Returned", bg: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  handed_over: { label: "At Security / Admin", bg: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
  closed: { label: "Closed", bg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700" },
};
