from services.embedding_service import registration_service
from services.recognition_service import recognition_service

while True:
    input_choice = input("\nEnter 'r' for registration or 'c' for recognition ('e' to exit): \n").strip().lower()

    if input_choice == 'r':
        registration_service()
    elif input_choice == 'c':
        class_name = input("Enter the class name: ")
        recognition_service(class_name)
    elif input_choice == 'e':
        print("Exiting...")
        break
    else:
        print("Invalid choice. Please try again.")