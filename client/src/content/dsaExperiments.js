export const dsaCourseInfo = {
  courseCode: "22CS302",
  courseName: "DATA STRUCTURES-I",
  department: "Department of Computer Science and Engineering",
  institution: "Bannari Amman Institute of Technology",
  regulation: "2022",
  semester: "III",
  batch: "2025-26",
};

export const dsaExperiments = [
  {
    id: "exp-1",
    expNumber: "1",
    courseOutcome: "CO2",
    badge: "Stack & Queue",
    title:
      "Ex.No:1 IMPLEMENTATION OF STACK AND QUEUE USING PYTHON CLASSES FOR A SUPERMARKET BASKET AND CHECKOUT QUEUE",
    shortTitle: "Supermarket Basket & Checkout Queue (Stack & Queue)",
    filename: "exp1_supermarket_stack_queue.py",
    aim: "To implement Stack and Queue data structures in Python using the list and dequeue collections, respectively, to simulate a supermarket scenario involving basket item storage and checkout queue processing.",
    possibleIdeas: [
      "1. Limited-Capacity Basket Using Stack: Implement a stack with maximum capacity to simulate real-world basket size limit.",
      "2. Express Checkout Simulation: Use multiple queues to simulate regular and express checkout lines based on basket size.",
      "3. Undo/Redo Cart Operations: Allow customers to undo and redo adding/removing items using two stacks.",
      "4. Time-Based Checkout Queue: Assign checkout times and process in FIFO order while displaying estimated wait times.",
      "5. Category-Based Item Grouping: Organize basket items into sub-stacks based on item categories (food, hygiene).",
    ],
    algorithm: [
      "1. Stack Implementation (Basket): Initialize an empty list self.stack.",
      "2. Add Item (Push): Use append() to push an item to the basket stack.",
      "3. Remove Item (Pop): If stack not empty, use pop() to remove the top item; otherwise show empty message.",
      "4. View Basket: Display all current items in the basket stack.",
      "5. Queue Implementation (CheckoutQueue): Initialize an empty queue using collections.deque().",
      "6. Join Queue (Enqueue): Add customer name to the checkout queue using append().",
      "7. Process Customer (Dequeue FIFO): If queue not empty, pop the front customer using popleft().",
      "8. View Queue: Display list of waiting customers in the checkout queue.",
    ],
    code: `from collections import deque

# Stack Implementation for Basket
class Basket:
    def __init__(self):
        self.stack = []

    def add_item(self, item):
        self.stack.append(item)
        print(f"Added {item} to basket.")

    def remove_item(self):
        if self.stack:
            item = self.stack.pop()
            print(f"Removed {item} from basket.")
        else:
            print("Basket is empty!")

    def view_basket(self):
        if self.stack:
            print("Basket items:", self.stack)
        else:
            print("Basket is empty!")

# Queue Implementation for Checkout
class CheckoutQueue:
    def __init__(self):
        self.queue = deque()

    def join_queue(self, customer_name):
        self.queue.append(customer_name)
        print(f"{customer_name} joined the checkout queue.")

    def process_customer(self):
        if self.queue:
            customer = self.queue.popleft()
            print(f"{customer} has been checked out.")
        else:
            print("No customers in queue!")

    def view_queue(self):
        if self.queue:
            print("Checkout queue:", list(self.queue))
        else:
            print("Queue is empty!")

# Simulating the Supermarket Application
basket = Basket()
checkout = CheckoutQueue()

# Customer actions (Stack: LIFO)
basket.add_item("Milk")
basket.add_item("Bread")
basket.view_basket()
basket.remove_item()
basket.view_basket()

# Checkout process (Queue: FIFO)
checkout.join_queue("Customer1")
checkout.join_queue("Customer2")
checkout.view_queue()
checkout.process_customer()
checkout.view_queue()
`,
    sampleOutput: `Added Milk to basket.
Added Bread to basket.
Basket items: ['Milk', 'Bread']
Removed Bread from basket.
Basket items: ['Milk']
Customer1 joined the checkout queue.
Customer2 joined the checkout queue.
Checkout queue: ['Customer1', 'Customer2']
Customer1 has been checked out.
Checkout queue: ['Customer2']`,
    result:
      "Thus the python program for the implementation for the supermarket application using Stack and Queue for basket storage and checkout respectively has been successfully executed.",
  },
  {
    id: "exp-2",
    expNumber: "2",
    courseOutcome: "CO3",
    badge: "Singly Linked List",
    title:
      "Ex.No:2 IMPLEMENT A PYTHON PROGRAM FOR USING A SINGLY LINKED LIST. MANAGING A TRAIN STATION AND NEED TO KEEP TRACK OF PASSENGERS ON A PARTICULAR TRAIN.",
    shortTitle: "Train Passenger Management (Singly Linked List)",
    filename: "exp2_train_passengers_linked_list.py",
    aim: "To develop a Python program using singly linked list data structure to manage train passengers by adding, removing, and displaying passenger records based on ticket number.",
    possibleIdeas: [
      "1. Coach-Wise Passenger Allocation: Represent each coach of the train as a separate linked list.",
      "2. Boarding and Deboarding Log: Maintain real-time linked list of passengers boarding (tail) or deboarding (head).",
      "3. Ticket Number Based Ordered Insertion: Keep the linked list sorted by ticket numbers for faster search.",
      "4. Circular Linked List for Staff: Use circular linked list to manage staff shift rotations on the train.",
      "5. Middle Node Update for Announcements: Insert or update middle node periodically for station broadcast.",
    ],
    algorithm: [
      "1. Passenger Node Structure: Define PassengerNode with fields: name, ticket_number, and next = None.",
      "2. Initialization: Initialize TrainPassengerList with self.head = None.",
      "3. Add Passenger: Create PassengerNode. If head is None, set head = new node; otherwise traverse to end and link.",
      "4. Remove Passenger: If head matches ticket_number, update head = head.next. Otherwise traverse with prev and current pointers, unlink matching node.",
      "5. Display Passengers: Traverse nodes from head to end and print passenger name and ticket number.",
    ],
    code: `# Node class to represent a Passenger
class PassengerNode:
    def __init__(self, name, ticket_number):
        self.name = name
        self.ticket_number = ticket_number
        self.next = None  # Pointer to next node

# Singly Linked List to manage train passengers
class TrainPassengerList:
    def __init__(self):
        self.head = None  # Initialize empty list

    # Add a passenger to the train (Append at end)
    def add_passenger(self, name, ticket_number):
        new_passenger = PassengerNode(name, ticket_number)
        if self.head is None:
            self.head = new_passenger
        else:
            temp = self.head
            while temp.next:
                temp = temp.next
            temp.next = new_passenger
        print(f"Passenger {name} (Ticket No: {ticket_number}) added.")

    # Remove a passenger by ticket number
    def remove_passenger(self, ticket_number):
        if self.head is None:
            print("No passengers to remove.")
            return

        # If head is the passenger to be removed
        if self.head.ticket_number == ticket_number:
            print(f"Passenger {self.head.name} (Ticket No: {ticket_number}) removed.")
            self.head = self.head.next
            return

        # Searching for the passenger in the list
        prev = None
        current = self.head
        while current and current.ticket_number != ticket_number:
            prev = current
            current = current.next

        if current is None:
            print(f"No passenger found with Ticket No: {ticket_number}")
        else:
            prev.next = current.next
            print(f"Passenger {current.name} (Ticket No: {ticket_number}) removed.")

    # Display all passengers in the train
    def display_passengers(self):
        if self.head is None:
            print("No passengers on the train.")
            return
        temp = self.head
        print("Current passengers on the train:")
        while temp:
            print(f"Name: {temp.name}, Ticket No: {temp.ticket_number}")
            temp = temp.next

# Simulating Train Passenger Management
train = TrainPassengerList()

# Adding passengers
train.add_passenger("Alice", 101)
train.add_passenger("Bob", 102)
train.add_passenger("Charlie", 103)

# Displaying passengers
train.display_passengers()

# Removing a passenger
train.remove_passenger(102)

# Displaying passengers after removal
train.display_passengers()
`,
    sampleOutput: `Passenger Alice (Ticket No: 101) added.
Passenger Bob (Ticket No: 102) added.
Passenger Charlie (Ticket No: 103) added.
Current passengers on the train:
Name: Alice, Ticket No: 101
Name: Bob, Ticket No: 102
Name: Charlie, Ticket No: 103
Passenger Bob (Ticket No: 102) removed.
Current passengers on the train:
Name: Alice, Ticket No: 101
Name: Charlie, Ticket No: 103`,
    result:
      "The program successfully demonstrates managing train passengers using a singly linked list in Python.",
  },
  {
    id: "exp-3",
    expNumber: "3",
    courseOutcome: "CO1",
    badge: "Dictionary / Hash Map",
    title:
      "Ex.No:3 CREATE A PYTHON PROGRAM THAT ALLOWS USERS TO SEARCH FOR A PERSON'S PHONE NUMBER QUICKLY IN THE PHONE DIRECTORY.",
    shortTitle: "Phone Directory Search (Hash Map Dictionary)",
    filename: "exp3_phone_directory_hashmap.py",
    aim: "To implement a phone directory system using Python dictionaries (hash maps) to add, search, delete, and display contacts efficiently.",
    possibleIdeas: [
      "1. Auto-Suggestion with Prefix Matching: Suggest contacts based on entered prefix.",
      "2. Case-Insensitive Search: Normalize names to lowercase for robust lookup.",
      "3. Contact Groups: Organize contacts into family, work, and emergency groups.",
      "4. Search and Update Feature: Allow updating phone number if found.",
      "5. Frequent Contact Sorting: Display top 5 most frequently searched contacts.",
    ],
    algorithm: [
      "1. Initialize Directory: Create dictionary self.directory = {} to store contacts (name as key, phone_number as value).",
      "2. Add Contact: Convert name to lowercase and store self.directory[name.lower()] = phone_number.",
      "3. Search Contact: Convert input to lowercase. Check if name exists in dictionary; display number if found.",
      "4. Delete Contact: Convert input to lowercase. If name exists, delete using del self.directory[name_lower].",
      "5. Display All Contacts: Traverse dictionary and print sorted names and phone numbers.",
      "6. Menu Loop: Continuously prompt user until Exit (choice 5) is selected.",
    ],
    code: `# Phone Directory using a Dictionary (Hash Map)
class PhoneDirectory:
    def __init__(self):
        self.directory = {}

    # Add a contact
    def add_contact(self, name, phone_number):
        self.directory[name.lower()] = phone_number
        print(f"Contact {name} added successfully.")

    # Search for a contact
    def search_contact(self, name):
        name_lower = name.lower()
        if name_lower in self.directory:
            print(f"{name}: {self.directory[name_lower]}")
        else:
            print(f"Contact {name} not found.")

    # Delete a contact
    def delete_contact(self, name):
        name_lower = name.lower()
        if name_lower in self.directory:
            del self.directory[name_lower]
            print(f"Contact {name} deleted successfully.")
        else:
            print(f"Contact {name} not found.")

    # Display all contacts
    def display_contacts(self):
        if not self.directory:
            print("Phone directory is empty.")
            return
        print("Phone Directory:")
        for name, phone in sorted(self.directory.items()):
            print(f"{name.title()}: {phone}")

# Menu-driven program
def main():
    phone_directory = PhoneDirectory()
    while True:
        print("\nPhone Directory Menu:")
        print("1. Add Contact")
        print("2. Search Contact")
        print("3. Delete Contact")
        print("4. Display All Contacts")
        print("5. Exit")
        choice = input("Enter your choice: ")
        if choice == '1':
            name = input("Enter contact name: ")
            phone_number = input("Enter phone number: ")
            phone_directory.add_contact(name, phone_number)
        elif choice == '2':
            name = input("Enter name to search: ")
            phone_directory.search_contact(name)
        elif choice == '3':
            name = input("Enter name to delete: ")
            phone_directory.delete_contact(name)
        elif choice == '4':
            phone_directory.display_contacts()
        elif choice == '5':
            print("Exiting Phone Directory. Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
`,
    sampleOutput: `Phone Directory Menu:
1. Add Contact
2. Search Contact
3. Delete Contact
4. Display All Contacts
5. Exit
Enter your choice: 1
Enter contact name: Alice
Enter phone number: 9876543210
Contact Alice added successfully.

Enter your choice: 1
Enter contact name: Bob
Enter phone number: 9123456789
Contact Bob added successfully.

Enter your choice: 4
Phone Directory:
Alice: 9876543210
Bob: 9123456789

Enter your choice: 2
Enter name to search: Alice
Alice: 9876543210

Enter your choice: 3
Enter name to delete: Bob
Contact Bob deleted successfully.

Enter your choice: 4
Phone Directory:
Alice: 9876543210

Enter your choice: 5
Exiting Phone Directory. Goodbye!`,
    result:
      "The program successfully implements a dictionary-based phone directory for quick contact lookup.",
  },
  {
    id: "exp-4",
    expNumber: "4",
    courseOutcome: "CO2",
    badge: "Lists & Sorting",
    title:
      "Ex.No:4 IMPLEMENT A PYTHON PROGRAM TO SORT THE STUDENT GRADES FOR THE QUIZ COMPETITION.",
    shortTitle: "Quiz Competition Student Grade Sorter",
    filename: "exp4_quiz_grades_sorting.py",
    aim: "To develop a comprehensive Python program to manage student names and grades for a quiz competition using lists and sorting, along with additional features like searching, updating, and displaying top performers.",
    possibleIdeas: [
      "1. Sort with Stable Tie-Breaker: If two students have equal grades, sort alphabetically by name.",
      "2. Top-N Performer Display: Allow user to enter N and display only top N ranked students.",
      "3. Section-Based Sorting: Store students based on section (A, B, C) and sort independently.",
      "4. Real-Time Leaderboard: Automatically display sorted leaderboard after each addition.",
      "5. Grade Distribution Histogram: Generate grade bracket counts.",
    ],
    algorithm: [
      "1. Initialize List: Create self.students = [] to store student data as (name, grade) tuples.",
      "2. Add Student: Append (name, grade) tuple to self.students.",
      "3. Sort Students: Use sorted(self.students, key=lambda x: x[1], reverse=True) to sort descending by grade.",
      "4. Search Student: Traverse list and compare name using .lower() for case-insensitive match.",
      "5. Update Grade: Locate student by name and replace tuple with updated grade.",
      "6. Top N Performers: Sort list and slice sorted_students[:n].",
      "7. Menu Loop: Continuously prompt user with options 1-6 until Exit.",
    ],
    code: `# Enhanced Student Grade Management System for Quiz Competition
class QuizCompetition:
    def __init__(self):
        self.students = []

    def add_student(self, name, grade):
        self.students.append((name, grade))
        print(f"Student '{name}' with grade {grade} added successfully.")

    def display_sorted_results(self):
        if not self.students:
            print("No student records available.")
            return
        sorted_students = sorted(self.students, key=lambda x: x[1], reverse=True)
        print("\n--- Sorted Student Grades ---")
        print("{:<5} {:<15} {:<10}".format("Rank", "Name", "Grade"))
        for idx, (name, grade) in enumerate(sorted_students, start=1):
            print("{:<5} {:<15} {:<10}".format(idx, name, grade))

    def search_student(self, name):
        found = False
        for student in self.students:
            if student[0].lower() == name.lower():
                print(f"Student '{student[0]}' has grade: {student[1]}")
                found = True
                break
        if not found:
            print(f"No record found for student '{name}'.")

    def update_grade(self, name, new_grade):
        for i in range(len(self.students)):
            if self.students[i][0].lower() == name.lower():
                self.students[i] = (self.students[i][0], new_grade)
                print(f"Grade updated for student '{self.students[i][0]}'.")
                return
        print(f"No student found with the name '{name}'.")

    def top_n_performers(self, n):
        if not self.students:
            print("No student records available.")
            return
        sorted_students = sorted(self.students, key=lambda x: x[1], reverse=True)
        print(f"\n--- Top {n} Performers ---")
        print("{:<5} {:<15} {:<10}".format("Rank", "Name", "Grade"))
        for idx, (name, grade) in enumerate(sorted_students[:n], start=1):
            print("{:<5} {:<15} {:<10}".format(idx, name, grade))

def main():
    quiz = QuizCompetition()
    while True:
        print("\n===== Quiz Competition Grade Manager =====")
        print("1. Add Student")
        print("2. Display Sorted Results")
        print("3. Search Student")
        print("4. Update Student Grade")
        print("5. Display Top N Performers")
        print("6. Exit")
        choice = input("Enter your choice (1-6): ")
        if choice == '1':
            name = input("Enter student's name: ")
            try:
                grade = float(input("Enter student's grade: "))
                quiz.add_student(name, grade)
            except ValueError:
                print("Invalid grade! Please enter a numeric value.")
        elif choice == '2':
            quiz.display_sorted_results()
        elif choice == '3':
            name = input("Enter student's name to search: ")
            quiz.search_student(name)
        elif choice == '4':
            name = input("Enter student's name to update: ")
            try:
                new_grade = float(input("Enter new grade: "))
                quiz.update_grade(name, new_grade)
            except ValueError:
                print("Invalid grade! Please enter a numeric value.")
        elif choice == '5':
            try:
                n = int(input("Enter number of top performers to display: "))
                quiz.top_n_performers(n)
            except ValueError:
                print("Invalid number! Please enter an integer.")
        elif choice == '6':
            print("Exiting the program. Goodbye!")
            break
        else:
            print("Invalid choice. Please enter a number between 1 and 6.")

if __name__ == "__main__":
    main()
`,
    sampleOutput: `===== Quiz Competition Grade Manager =====
1. Add Student
2. Display Sorted Results
3. Search Student
4. Update Student Grade
5. Display Top N Performers
6. Exit
Enter your choice (1-6): 1
Enter student's name: Alice
Enter student's grade: 89
Student 'Alice' with grade 89.0 added successfully.
...
Enter your choice (1-6): 5
Enter number of top performers to display: 2
--- Top 2 Performers ---
Rank Name Grade 
1 Bob 95.0 
2 Alice 89.0`,
    result:
      "The program successfully manages student records for a quiz competition with features like sorting, searching, updating, and ranking.",
  },
  {
    id: "exp-5",
    expNumber: "5",
    courseOutcome: "CO4",
    badge: "Hashing & Digital Signature",
    title:
      "Ex.No:5 IMPLEMENT A DIGITAL SIGNATURE GENERATOR AND VERIFIER USING HASH FUNCTIONS AND PUBLIC-KEY CRYPTOGRAPHY. USERS CAN SIGN DOCUMENTS AND VERIFY THE AUTHENTICITY OF SIGNED DOCUMENTS.",
    shortTitle: "Digital Signature Generator & Verifier (Hashing)",
    filename: "exp5_digital_signature_hashing.py",
    aim: "To implement a digital signature generator and verifier using hash functions in Python, applying hashing concepts from Data Structures.",
    possibleIdeas: [
      "1. Simple Hash-Based Signature: Concatenate document and passphrase, then hash using custom string formula.",
      "2. Signature Tamper Detection: Modify document to demonstrate failed verification.",
      "3. Multiple Document Signing: Store multiple documents and signatures in dictionary.",
      "4. Block-wise Hash Verification: Break large document into parts and hash individually.",
      "5. Timestamp-Appended Signature: Append timestamp to simulate time-sensitive signing.",
    ],
    algorithm: [
      "1. Hash Function: For each character at index i, add (i + 1) * ord(char) to hash_value; return hash_value % 1000000007.",
      "2. Generate Signature: Concatenate document + passcode, calculate and return hash value.",
      "3. Verify Signature: Recalculate hash for entered document + passcode; if recalculated_signature == given_signature, mark authentic, else mismatch.",
      "4. Menu Interface: Options to 1. Generate Signature, 2. Verify Signature, 3. Exit.",
    ],
    code: `# Simple hashing function (data structures concept)
def simple_hash(text):
    hash_value = 0
    prime_mod = 1000000007  # To keep hash values within a limit
    for i, char in enumerate(text):
        hash_value += (i + 1) * ord(char)
    return hash_value % prime_mod

# Function to generate a digital signature
def generate_signature(document, passcode):
    combined = document + passcode
    signature = simple_hash(combined)
    return signature

# Function to verify digital signature
def verify_signature(document, passcode, given_signature):
    combined = document + passcode
    recalculated_signature = simple_hash(combined)
    if recalculated_signature == given_signature:
        print("Document is authentic. Signature verified.")
    else:
        print("Document integrity check failed. Signature mismatch.")

# Menu-driven interface
def main():
    while True:
        print("\n--- Digital Signature Simulator (Hashing Only) ---")
        print("1. Generate Signature")
        print("2. Verify Signature")
        print("3. Exit")
        choice = input("Enter your choice (1-3): ")
        if choice == '1':
            doc = input("Enter document content: ")
            passcode = input("Enter secret passcode: ")
            signature = generate_signature(doc, passcode)
            print(f"Generated Signature (Hash): {signature}")
        elif choice == '2':
            doc = input("Enter document content: ")
            passcode = input("Enter secret passcode: ")
            try:
                given_signature = int(input("Enter signature to verify: "))
                verify_signature(doc, passcode, given_signature)
            except ValueError:
                print("Invalid signature input. Must be a number.")
        elif choice == '3':
            print("Exiting program. Thank you!")
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main()
`,
    sampleOutput: `--- Digital Signature Simulator (Hashing Only) ---
1. Generate Signature
2. Verify Signature
3. Exit
Enter your choice (1-3): 1
Enter document content: StudentMarks2024
Enter secret passcode: admin123
Generated Signature (Hash): 18465

Enter your choice (1-3): 2
Enter document content: StudentMarks2024
Enter secret passcode: admin123
Enter signature to verify: 18465
Document is authentic. Signature verified.`,
    result:
      "The program demonstrates how to generate and verify digital signatures using a manual hashing function based on data structure principles.",
  },
  {
    id: "exp-6",
    expNumber: "6",
    courseOutcome: "CO5",
    badge: "Graph Traversal (BFS & DFS)",
    title:
      "Ex.No:6 IMPLEMENT A PYTHON PROGRAM TO GIVE A DIRECTION FOR A STRANGER. LANDMARK WILL BE CONSIDERED AS A NODE AND THE PATH BETWEEN THE TWO LANDMARK IS THE LINK.",
    shortTitle: "Landmark Navigation using Graph Traversal (BFS & DFS)",
    filename: "exp6_landmark_graph_bfs_dfs.py",
    aim: "To implement a Python program that provides directions between landmarks, using graph traversal techniques such as Breadth-First Search (BFS) and Depth-First Search (DFS). Each landmark is a node, and the path between landmarks is a link.",
    possibleIdeas: [
      "1. Campus Navigation: Model campus buildings as nodes and pathways as undirected edges.",
      "2. Dynamic Graph: Let users define custom landmarks and connections dynamically.",
      "3. Shortest Path by Step Count: Use BFS to calculate minimum hops between landmarks.",
      "4. 2D Grid Landmark Layout: Traverse grid map in 4 directions with BFS/DFS.",
      "5. Category Filter: Find paths only through specific landmark types (e.g. food, labs).",
    ],
    algorithm: [
      "1. Breadth-First Search (BFS): Initialize queue with [(start, [start])]. Dequeue node and path; if node == end, return path. Add unvisited neighbors to queue. Return None if no path.",
      "2. Depth-First Search (DFS): Mark current visited, append to path. If current == end, return path.copy(). Recursively visit unvisited neighbors; backtrack with path.pop() if path fails.",
      "3. Driver Function: Display available landmarks, prompt start and destination, prompt BFS or DFS method, and output directional path (A -> B -> E -> G).",
    ],
    code: `from collections import deque

# Graph: landmarks and their connections
landmarks = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['G'],
    'F': [],
    'G': []
}

# Breadth-First Search for shortest path
def bfs(start, end):
    visited = set()
    queue = deque([(start, [start])])
    while queue:
        current, path = queue.popleft()
        if current == end:
            return path
        visited.add(current)
        for neighbor in landmarks.get(current, []):
            if neighbor not in visited:
                queue.append((neighbor, path + [neighbor]))
    return None

# Depth-First Search for path
def dfs(current, end, visited, path):
    visited.add(current)
    path.append(current)
    if current == end:
        return path.copy()
    for neighbor in landmarks.get(current, []):
        if neighbor not in visited:
            result = dfs(neighbor, end, visited, path)
            if result:
                return result
    path.pop()
    return None

# Helper to start DFS
def get_directions_dfs(start, end):
    return dfs(start, end, set(), [])

# Main driver function
def main():
    print("Available Landmarks:")
    for key in landmarks:
        print(f" - {key}: connects to {landmarks[key]}")

    start = input("Enter starting landmark: ").strip().upper()
    end = input("Enter destination landmark: ").strip().upper()

    if start not in landmarks or end not in landmarks:
        print("Invalid landmarks entered.")
        return

    choice = input("Choose method - BFS or DFS? (B/F): ").strip().upper()

    if choice == 'B':
        path = bfs(start, end)
        method = "BFS"
    elif choice == 'F':
        path = get_directions_dfs(start, end)
        method = "DFS"
    else:
        print("Invalid choice.")
        return

    if path:
        print(f"\nDirections using {method}:")
        print(" -> ".join(path))
    else:
        print(f"No path found from {start} to {end} using {method}.")

# Run program
if __name__ == "__main__":
    main()
`,
    sampleOutput: `Available Landmarks:
- A: connects to ['B', 'C']
- B: connects to ['D', 'E']
- C: connects to ['F']
- D: connects to []
- E: connects to ['G']
- F: connects to []
- G: connects to []

Enter starting landmark: A
Enter destination landmark: G
Choose method - BFS or DFS? (B/F): B

Directions using BFS:
A -> B -> E -> G`,
    result:
      "The program efficiently provides directions between landmarks using graph traversal techniques.",
  },
];
