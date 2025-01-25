import os

def create_html_files():
    print("Créateur de fichiers HTML")
    print("Tape 'stop' pour arrêter.")

    while True:
        # Demander le nom du fichier
        file_name = input("Nom du fichier (sans extension) : ")
        
        if file_name.lower() == "stop":
            print("Création de fichiers arrêtée.")
            break
        
        file_name = file_name.replace(" ", "+")

        # Ajouter l'extension .html au nom du fichier
        file_name_with_extension = f"{file_name}.html"
        
        # Vérifier si le fichier existe déjà
        if os.path.exists(file_name_with_extension):
            print(f"Le fichier '{file_name_with_extension}' existe déjà. Choisissez un autre nom.")
            continue
        
        # Créer le fichier avec du contenu de base
        with open(file_name_with_extension, "w") as file:
            file.write("")
        
        print(f"Fichier '{file_name_with_extension}' créé avec succès.")

# Lancer la fonction
if __name__ == "__main__":
    create_html_files()
