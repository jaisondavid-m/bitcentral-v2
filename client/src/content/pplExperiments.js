export const pplCourseInfo = {
  courseCode: "",
  courseName: "PRINCIPLES OF PROGRAMMING LABORATORY",
  department: "Department of Artificial Intelligence and Machine Learning",
  institution: "Bannari Amman Institute of Technology",
  degree: "B.E",
  semester: "III",
  yearOfRelease: "2024",
  batch: "2023-2024",
};

export const pplExperiments = [
  {
    id: "exp-1",
    expNumber: "1",
    badge: "Shopping Cart & Billing",
    title:
      "EX NO:01 ONLINE SHOPPING CART: DEVELOP AN APPLICATION TO IMPLEMENT AN ONLINE SHOPPING CART AND GENERATE BILLS FOR THE PURCHASED PRODUCTS",
    shortTitle: "Online Shopping Cart & Bill Generator",
    filename: "exp1_online_shopping_cart.py",
    aim: "The aim of this experiment is to develop an application using Python to implement an online shopping cart and generate bills for the purchased products.",
    procedure: [
      "Step 1: Initialize an empty shopping cart (usually a list or data structure) to store the selected products and initialize variables to keep track of the total bill and any discounts or promotions.",
      "Step 2: Display a list of available products to the user, typically fetched from a database or hard-coded in the application and allow the user to add products to the shopping cart by specifying the product's name, quantity, and price.",
      "Step 3: Update the shopping cart by adding or removing products as per the user's selection and Calculate the subtotal for each product (quantity * price) and update the total bill.",
      "Step 4: Implement any discounts or promotions that may apply, such as percentage discounts, buy-one-get-one deals, or special offers and update the total bill with the applied discounts.",
      "Step 5: Calculate any applicable taxes (e.g., sales tax) and add them to the total bill.",
      "Step 6: Display an itemized bill to the user, listing the selected products, quantities, prices, and subtotals and display the total bill, including discounts, taxes, and the final amount to be paid by the customer.",
      "Step 7: If your application supports online payments, integrate a payment gateway to allow users to make the payment and update the transaction history and order records in your database.",
      "Step 8: Provide options for the user to continue shopping, clear the cart, or exit the application.",
    ],
    code: `class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

class ShoppingCart:
    def __init__(self):
        self.cart = []

    def add_item(self, product, quantity):
        self.cart.append((product, quantity))

    def remove_item(self, product, quantity):
        self.cart = [(p, q) for p, q in self.cart if p != product or q != quantity]

    def calculate_total(self):
        total = 0
        for product, quantity in self.cart:
            total += product.price * quantity
        return total

    def generate_bill(self):
        print("===== Invoice =====")
        for product, quantity in self.cart:
            print(f"{product.name}: {product.price} x {quantity} = {product.price * quantity}")
        print("Total: ", self.calculate_total())

if __name__ == "__main__":
    apple = Product("Apple", 0.5)
    banana = Product("Banana", 0.25)
    orange = Product("Orange", 0.75)

    cart = ShoppingCart()
    cart.add_item(apple, 5)
    cart.add_item(banana, 10)
    cart.add_item(orange, 3)
    cart.generate_bill()
`,
    sampleOutput: `===== Invoice =====
Apple: 0.5 x 5 = 2.5
Banana: 0.25 x 10 = 2.5
Orange: 0.75 x 3 = 2.25
Total:  7.25`,
    result:
      "Thus, the application to implement an online shopping cart and generate bills for the purchased products is developed using Python programming.",
  },
  {
    id: "exp-2",
    expNumber: "2",
    badge: "Inventory Management",
    title:
      "EX NO:02 POCKET BAZAAR: DEVELOP AN APPLICATION TO MANAGE AN INVENTORY OF PRODUCTS FOR GROCERY STORES",
    shortTitle: "Pocket Bazaar - Grocery Store Inventory Manager",
    filename: "exp2_pocket_bazaar_inventory.py",
    aim: "The aim of this experiment is to develop an application using Python to manage an inventory of products for grocery store to purchase products.",
    procedure: [
      "Step 1: Create a Python class to represent a product. This class should have attributes like name, price, quantity, and category. Create another class to manage the inventory. This class should have methods for adding, updating, and displaying products.",
      "Step 2: Create a database to store product information. SQLite, MySQL, or PostgreSQL are popular choices.",
      "Step 3: Create a user interface for interacting with the application. Use the built-in Python input() function for command-line interfaces, or choose a GUI library like Tkinter or a web framework like Flask or Django for a more advanced interface.",
      "Step 4: Implement the core functionality such as Add new products to the inventory, Update existing product details, Display the list of products and Implement error handling to deal with invalid inputs or data retrieval issues.",
      "Step 5: Display the inventory shopping cart based on the choices selected by the user.",
      "Step 6: Continue to interact with the program by selecting options 1, 2, or 3 or exit the program by selecting option 4.",
    ],
    code: `class Product:
    def __init__(self, name, price, quantity, category):
        self.name = name
        self.price = price
        self.quantity = quantity
        self.category = category

class Inventory:
    def __init__(self):
        self.products = {}

    def add_product(self, product):
        if product.name not in self.products:
            self.products[product.name] = product
        else:
            print("Product already exists in the inventory.")

    def update_product(self, product):
        if product.name in self.products:
            self.products[product.name] = product
        else:
            print("Product not found in the inventory.")

    def display_inventory(self):
        print("\\n Inventory:")
        for product in self.products.values():
            print(f" Name: {product.name}, Price: {product.price}, Quantity: {product.quantity}, Category: {product.category}")

def main():
    inventory = Inventory()
    while True:
        print("\\n Options:")
        print("1. Add a product to the inventory")
        print("2. Update product details")
        print("3. Display inventory")
        print("4. Exit")
        choice = input("Enter your choice: ")
        if choice == '1':
            name = input("Enter product name: ")
            price = float(input("Enter product price: "))
            quantity = int(input("Enter product quantity: "))
            category = input("Enter product category: ")
            product = Product(name, price, quantity, category)
            inventory.add_product(product)
            print("Product added to the inventory.")
        elif choice == '2':
            name = input("Enter product name to update: ")
            if name in inventory.products:
                price = float(input("Enter updated product price: "))
                quantity = int(input("Enter updated product quantity: "))
                category = input("Enter updated product category: ")
                updated_product = Product(name, price, quantity, category)
                inventory.update_product(updated_product)
                print(f"{name} updated successfully.")
            else:
                print(f"{name} not found in the inventory.")
        elif choice == '3':
            inventory.display_inventory()
        elif choice == '4':
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
`,
    sampleOutput: ` Options:
1. Add a product to the inventory
2. Update product details
3. Display inventory
4. Exit
Enter your choice: 1
Enter product name: Apple
Enter product price: 1.5
Enter product quantity: 50
Enter product category: Fruits
Product added to the inventory.

 Options:
1. Add a product to the inventory
2. Update product details
3. Display inventory
4. Exit
Enter your choice: 3

 Inventory:
 Name: Apple, Price: 1.5, Quantity: 50, Category: Fruits

 Options:
1. Add a product to the inventory
2. Update product details
3. Display inventory
4. Exit
Enter your choice: 4`,
    result:
      "Thus, the application to manage an inventory of products for grocery store using python is developed.",
  },
  {
    id: "exp-3",
    expNumber: "3",
    badge: "Decision Maker & Logic",
    title:
      "EX NO:03 VACATION DESTINATION DECISION MAKER: CREATE AN APPLICATION PROGRAM THAT HELPS A USER DECIDE ON THEIR NEXT VACATION DESTINATION BASED ON THEIR PREFERENCES",
    shortTitle: "Vacation Destination Decision Maker",
    filename: "exp3_vacation_decision_maker.py",
    aim: "The aim of this experiment is to develop an application using Python to provide users with a recommendation for their vacation destinations based on their preferences.",
    procedure: [
      "Step 1: Initialize a list of vacation destinations with their attributes (name, weather, budget, activities).",
      "Step 2: Prompt the user to input their preferences, including preferred weather, budget and activities.",
      "Step 3: Split the users list of activities into individual activity preferences.",
      "Step 4: Create an empty list to store compatible destinations.",
      "Step 5: Iterate through each destination in the list:\n  a. Check if the destinations attributes (weather, budget, activities) match the user's preferences.\n  b. If all attributes match, add the destination to the list of compatible destinations.",
      "Step 6: If there are compatible destinations in the list:\n  a. Randomly select on destinations from the list of compatible destinations.\n  b. Display the recommended destination to the user.",
      "Step 7: If there are no compatible destinations, inform the user that no matching destinations were found based on their preferences.",
      "Step 8: Provide options for the user to continue their preferences, or exit the application.",
    ],
    code: `def get_user_preferences():
    print("Welcome to Vacation Destination Decision Maker!")
    budget = float(input("What is your budget for the vacation? $"))
    weather = input("Do you prefer a warm or cold climate? (warm/cold): ").lower()
    activities = input("What activities do you enjoy? (beach/mountains/hiking/city): ").lower()
    return budget, weather, activities

destination_budgets = {
    "Maldives": 5000,
    "Bahamas": 4000,
    "Hawaii": 4500,
    "Costa Rica": 3500,
    "Bali": 3000,
    "Canary Islands": 4000,
    "Switzerland": 4500,
    "New Zealand": 4000,
    "Norway": 5000,
    "Paris": 3500,
    "Tokyo": 4000,
    "New York": 4000
}

def suggest_destination(budget, weather, activities):
    destinations = {
        "warm": {
            "beach": ["Maldives", "Bahamas", "Hawaii"],
            "mountains": ["Costa Rica", "Bali", "Canary Islands"]
        },
        "cold": {
            "hiking": ["Switzerland", "New Zealand", "Norway"],
            "city": ["Paris", "Tokyo", "New York"]
        }
    }
    suggested_destinations = []
    if weather in destinations.keys() and activities in destinations[weather].keys():
        suggested_destinations = destinations[weather][activities]
    affordable_destinations = [destination for destination in suggested_destinations if destination_budgets[destination] <= budget]
    return affordable_destinations

def main():
    budget, weather, activities = get_user_preferences()
    suggested_destinations = suggest_destination(budget, weather, activities)
    if suggested_destinations:
        print("Based on your preferences, here are some suggested destinations:")
        for destination in suggested_destinations:
            print("- " + destination)
    else:
        print("Sorry, we couldn't find a suitable destination based on your preferences.")

if __name__ == "__main__":
    main()
`,
    sampleOutput: `Welcome to Vacation Destination Decision Maker!
What is your budget for the vacation? $4000
Do you prefer a warm or cold climate? (warm/cold): warm
What activities do you enjoy? (beach/mountains/hiking/city): beach
Based on your preferences, here are some suggested destinations:
- Bahamas

Welcome to Vacation Destination Decision Maker!
What is your budget for the vacation? $3000
Do you prefer a warm or cold climate? (warm/cold): warm
What activities do you enjoy? (beach/mountains/hiking/city): mountains
Based on your preferences, here are some suggested destinations:
- Bali`,
    result:
      "Thus, the application Vacation Destination Decision Maker is developed based on user preferences.",
  },
  {
    id: "exp-4",
    expNumber: "4",
    badge: "Monitoring & Timers",
    title:
      "EX NO:04 TEMPERATURE MONITOR: DEVELOP AN APPLICATION FOR A TEMPERATURE MONITORING SYSTEM AND PROVIDE AN ALERT MESSAGE",
    shortTitle: "Temperature Monitoring & Alert System",
    filename: "exp4_temperature_monitor.py",
    aim: "To develop an application for a temperature monitoring system and provide an alert message.",
    procedure: [
      "Step 1: Install Required Libraries:\n  a. Ensure that you have Python installed on your system.\n  b. No additional libraries are required for this simple example.",
      "Step 2: Create the Temperature Monitoring Script:\n  a. Define a function read_temperature() to simulate temperature readings between 20 and 30 degrees Celsius.\n  b. Set a threshold value for the temperature.\n  c. Create a function monitor_temperature() that checks if the current temperature is above the threshold and returns a boolean and the current temperature.\n  d. Use a while True loop to continuously monitor the temperature.\n  e. Inside the loop, call the monitor_temperature() function to check if the temperature is above the threshold.\n  f. If an alert is triggered, print an alert message indicating that the temperature is above the threshold.\n  g. If no alert is triggered, print a normal temperature message.\n  h. Add a time delay using time.sleep(5) to wait for 5 seconds before checking the temperature again.",
      "Step 3: Create the Alert Message Script:\n  a. Extend your existing script to include more detailed alert messages or actions.\n  b. For example, you could send an email notification, log the alert to a file, or integrate with other notification services.\n  c. Modify the monitor_temperature() function to include additional actions when an alert is triggered.",
      "Step 4: Run the Script:\n  a. Save the script with an appropriate filename and a .py extension.\n  b. Open a terminal or command prompt and navigate to the directory containing your script.\n  c. Run the script by executing the command python script_name.py.",
    ],
    code: `import random
import time

def read_temperature():
    return random.uniform(20, 30)

threshold = 25.0

def monitor_temperature():
    temperature = read_temperature()
    if temperature > threshold:
        return True, temperature
    else:
        return False, temperature

while True:
    alert, current_temperature = monitor_temperature()
    if alert:
        print(f"ALERT: Temperature is above the threshold! Current temperature: {current_temperature:.2f}°C")
    else:
        print(f"Temperature is normal. Current temperature: {current_temperature:.2f}°C")
    time.sleep(5)
`,
    sampleOutput: `Temperature is normal. Current temperature: 21.37°C
Temperature is normal. Current temperature: 27.84°C
ALERT: Temperature is above the threshold! Current temperature: 26.91°C
Temperature is normal. Current temperature: 22.15°C
Temperature is normal. Current temperature: 24.62°C
ALERT: Temperature is above the threshold! Current temperature: 25.98°C
Temperature is normal. Current temperature: 22.43°C
Temperature is normal. Current temperature: 24.02°C
...`,
    result:
      "Thus, the temperature monitoring system and provide an alert message has been executed successfully.",
  },
  {
    id: "exp-5",
    expNumber: "5",
    badge: "Security & File I/O",
    title:
      "EX NO:05 DEVELOP AN ACCESS CONTROL SYSTEM THAT SIMULATES THE GRANTING ACCESS TO AUTHORIZED PERSONNEL BASED ON THEIR CREDENTIALS, SUCH AS ID CARDS AND PIN CODES",
    shortTitle: "Access Control System (MD5 Hashing & Credentials)",
    filename: "exp5_access_control_system.py",
    aim: "The aim of this experiment is to develop an application using Python to develop an access control system that simulates granting access to authorized personnel based on their credentials, such as ID cards and PIN codes.",
    procedure: [
      "Step 1: Create signup() function:\n  a. Takes user input for email, password, and confirmation of the password.\n  b. Checks if the confirmation password matches the password.\n  c. If the passwords match, it encodes and hashes the password using MD5.\n  d. Writes the email and hashed password to a file called 'credentials.txt'.\n  e. Prints a success message if the registration is successful.",
      "Step 2: Create login() function:\n  a. Takes user input for email and password.\n  b. Hashes the entered password using MD5.\n  c. Reads the stored email and password hash from 'credentials.txt'.\n  d. Compares the entered email and hashed password with the stored values.\n  e. Prints a success message if the login is successful.",
      "Step 3: Create the main loop:\n  a. Continuously displays a menu with options for signup, login, and exit.\n  b. Read the user's choice.\n  c. Calls the appropriate function (signup or login) based on the user's choice.\n  d. Exits the loop when the user chooses option 3.",
    ],
    code: `import hashlib

def signup():
    email = input("Enter email address: ")
    pwd = input("Enter password: ")
    conf_pwd = input("Confirm password: ")
    if conf_pwd == pwd:
        enc = conf_pwd.encode()
        hash1 = hashlib.md5(enc).hexdigest()
        with open("credentials.txt", "w") as f:
            f.write(email + "\\n")
            f.write(hash1)
            f.close()
        print("You have registered successfully!")
    else:
        print("Password is not same as above! \\n")

def login():
    email = input("Enter email: ")
    pwd = input("Enter password: ")
    auth = pwd.encode()
    auth_hash = hashlib.md5(auth).hexdigest()
    with open("credentials.txt", "r") as f:
        stored_email, stored_pwd = f.read().split("\\n")
        f.close()
    if email == stored_email and auth_hash == stored_pwd:
        print("Logged in Successfully!")
    else:
        print("Login failed! \\n")

while 1:
    print("********** Login System **********")
    print("1.Signup")
    print("2.Login")
    print("3.Exit")
    ch = int(input("Enter your choice: "))
    if ch == 1:
        signup()
    elif ch == 2:
        login()
    elif ch == 3:
        break
    else:
        print("Wrong Choice!")
`,
    sampleOutput: `********** Login System **********
1.Signup
2.Login
3.Exit
Enter your choice: 1
Enter email address: ammu@bitsathy.ac.in
Enter password: Mamtha@31
Confirm password: Mamtha@31
You have registered successfully!

********** Login System **********
1.Signup
2.Login
3.Exit
Enter your choice: 2
Enter email: ammu@bitsathy.ac.in
Enter password: Mamtha@31
Logged in Successfully!

********** Login System **********
1.Signup
2.Login
3.Exit
Enter your choice: 3`,
    result:
      "Thus, the application to develop an access control system that simulates granting access to authorized personnel based on their email and password.",
  },
  {
    id: "exp-6",
    expNumber: "6",
    badge: "Randomization & Arithmetic",
    title:
      "EX NO:06 MATH QUIZ GENERATOR: DESIGN A MATH QUIZ GENERATOR THAT GENERATES QUESTIONS OF VARIOUS DIFFICULTY LEVELS AND ARITHMETIC OPERATIONS",
    shortTitle: "Math Quiz Generator (Multi-Level Arithmetic)",
    filename: "exp6_math_quiz_generator.py",
    aim: "The aim of this experiment is to develop an application using Python to generate questions of various difficulty levels and arithmetic operations.",
    procedure: [
      "Step 1: Define the Quiz Parameters:\n  a. Decide on the total number of questions in the quiz (e.g., num_questions).\n  b. Determine the desired difficulty levels (e.g., 'easy', 'medium', and 'hard').\n  c. Choose the arithmetic operations to include (e.g., addition, subtraction, and multiplication).",
      "Step 2: Generate Questions:\n  For each question in the quiz (from 1 to num_questions), repeat the following steps:\n  a. Randomly select a difficulty level (e.g., using random.choice()).\n  b. Randomly select an arithmetic operation (e.g., using random.choice()).\n  c. Based on the selected difficulty and operation, generate a math question and its answer.",
      "Step 3: Question Generation:\n  a. Create functions for generating questions based on the selected difficulty level and operation.\n  b. These functions should generate random numbers based on the chosen difficulty level and apply the selected arithmetic operation.\n  c. The questions should be formatted as strings (e.g., 'What is 3 + 5?') along with the correct answer.",
      "Step 4: Store Questions:\n  Store each generated question and its correct answer in a data structure, such as a list or a dictionary.",
      "Step 5: Quiz Presentation:\n  Present the quiz to the user, one question at a time.\n  For each question, display the question to the user and prompt them to enter their answer.",
      "Step 6: User Input and Scoring:\n  a. Accept the user's input as their answer.\n  b. Compare the user's answer to the correct answer.\n  c. Keep track of the user's score (i.e., the number of correct answers).",
      "Step 7: Provide Feedback:\n  a. After each question, inform the user whether their answer was correct or not.\n  b. Display the correct answer if the user's response is incorrect.",
      "Step 8: End of Quiz:\n  After all questions have been presented, provide the user with their final score.",
    ],
    code: `import random

# Function to generate an addition question
def generate_addition_question(difficulty):
    if difficulty == "easy":
        num1 = random.randint(1, 10)
        num2 = random.randint(1, 10)
    elif difficulty == "medium":
        num1 = random.randint(10, 50)
        num2 = random.randint(10, 50)
    else: # "hard"
        num1 = random.randint(50, 100)
        num2 = random.randint(50, 100)
    question = f"What is {num1} + {num2}?"
    answer = num1 + num2
    return question, answer

# Function to generate a subtraction question
def generate_subtraction_question(difficulty):
    if difficulty == "easy":
        num1 = random.randint(1, 10)
        num2 = random.randint(1, 10)
    elif difficulty == "medium":
        num1 = random.randint(10, 50)
        num2 = random.randint(1, 10)
    else: # "hard"
        num1 = random.randint(50, 100)
        num2 = random.randint(10, 50)
    question = f"What is {num1} - {num2}?"
    answer = num1 - num2
    return question, answer

# Function to generate a multiplication question
def generate_multiplication_question(difficulty):
    if difficulty == "easy":
        num1 = random.randint(2, 5)
        num2 = random.randint(2, 5)
    elif difficulty == "medium":
        num1 = random.randint(6, 10)
        num2 = random.randint(2, 5)
    else: # "hard"
        num1 = random.randint(6, 10)
        num2 = random.randint(6, 10)
    question = f"What is {num1} * {num2}?"
    answer = num1 * num2
    return question, answer

# Main function to generate the quiz
def generate_quiz(num_questions, difficulty, operations):
    quiz = []
    for _ in range(num_questions):
        operation = random.choice(operations)
        if operation == "addition":
            question, answer = generate_addition_question(difficulty)
        elif operation == "subtraction":
            question, answer = generate_subtraction_question(difficulty)
        else: # multiplication
            question, answer = generate_multiplication_question(difficulty)
        quiz.append((question, answer))
    return quiz

# Function to display and evaluate the quiz
def take_quiz(quiz):
    score = 0
    for i, (question, answer) in enumerate(quiz, start=1):
        print(f"Question {i}: {question}")
        user_answer = input("Your answer: ")
        if int(user_answer) == answer:
            print("Correct!\\n")
            score += 1
        else:
            print(f"Wrong. The correct answer is {answer}.\\n")
    print(f"You scored {score}/{len(quiz)}")

if __name__ == "__main__":
    num_questions = 5
    difficulty = "medium" # Choose from "easy", "medium", or "hard"
    operations = ["addition", "subtraction", "multiplication"]
    quiz = generate_quiz(num_questions, difficulty, operations)
    take_quiz(quiz)
`,
    sampleOutput: `Question 1: What is 9 * 5?
Your answer: 45
Correct!

Question 2: What is 48 - 3?
Your answer: 45
Correct!

Question 3: What is 45 + 22?
Your answer: 67
Correct!

Question 4: What is 39 + 21?
Your answer: 50
Wrong. The correct answer is 60.

Question 5: What is 29 + 43?
Your answer: 72
Correct!

You scored 4/5`,
    result:
      "Thus, the application Math Quiz Generator is developed at various difficulty levels and arithmetic operations.",
  },
  {
    id: "exp-7",
    expNumber: "7",
    badge: "Backtracking & Maze Pathfinding",
    title:
      "EX NO:07 BUILD A MAZE SOLVER APPLICATION THAT FINDS A PATH FROM THE ENTRANCE TO THE EXIT OF A MAZE",
    shortTitle: "Maze Solver Application (2D Grid Backtracking)",
    filename: "exp7_maze_solver.py",
    aim: "To build a maze solver application that finds a path from the entrance to the exit of a maze",
    procedure: [
      "Step 1: Define the Maze:\nRepresent the maze as a 2D grid, where each cell can be open, a wall, the entrance, or the exit.",
      "Step 2: Initialize Data Structures:\n  a. Create an open set (usually a priority queue) to store cells to be explored.\n  b. Create a closed set (a set or list) to store cells that have already been explored.\n  c. Add the entrance cell to the open set with a cost of 0 (the initial node).",
      "Step 3: Main Loop:\nWhile the open set is not empty:\n  a. Pop the cell with the lowest cost from the open set. This cell becomes the current cell.\n  b. If the current cell is the exit, a path has been found. You can reconstruct the path and return it.\n  c. Otherwise, mark the current cell as explored by moving it to the closed set.\n  d. For each neighboring cell that is not a wall and is not in the closed set.",
      "Step 4: Calculate the tentative cost to reach that cell from the current cell:\n  a. If this tentative cost is lower than the cost associated with the neighbor (or the neighbor is not in the open set), update the neighbor's cost and set the current cell as the parent of the neighbor.\n  b. Add the neighbor to the open set with the updated cost.\n  c. If the open set becomes empty, and the exit has not been reached, there is no path from the entrance to the exit.",
      "Step 5: Path Reconstruction:\nOnce the exit cell is reached, you can backtrack from the exit cell to the entrance using the parent pointers set during the search. This will give you the path from the entrance to the exit.",
    ],
    code: `def is_valid(x, y, maze):
    # Check if the current cell is within the bounds of the maze
    if 0 <= x < len(maze) and 0 <= y < len(maze[0]):
        # Check if the current cell is an open path
        if maze[x][y] == 0:
            return True
    return False

def solve_maze(maze, start, end, path=[]):
    x, y = start
    # Mark the current cell as visited
    maze[x][y] = 2
    path.append((x, y))
    if start == end:
        return path
    # Define the possible movements (right, down, left, up)
    moves = [(1, 0), (0, 1), (-1, 0), (0, -1)]
    for move in moves:
        new_x, new_y = x + move[0], y + move[1]
        if is_valid(new_x, new_y, maze):
            new_start = (new_x, new_y)
            result = solve_maze(maze, new_start, end, path)
            if result:
                return result
    # If no path is found, backtrack
    path.pop()
    return None

def print_maze(maze):
    for row in maze:
        print(" ".join(map(str, row)))

if __name__ == "__main__":
    maze = [
        [0, 1, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0]
    ]
    start = (0, 0)
    end = (4, 4)
    result = solve_maze(maze, start, end)
    if result:
        print("Path found:")
        for x, y in result:
            maze[x][y] = 3
        print_maze(maze)
    else:
        print("No path found.")
`,
    sampleOutput: `Path found:
3 1 0 0 0
3 1 0 1 0
3 0 0 0 0
3 1 1 1 1
3 3 3 3 3`,
    result:
      "Thus, the application maze solver is developed has been executed successfully.",
  },
];
