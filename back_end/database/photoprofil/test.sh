# Base URL
base_url="https://www.polytech.umontpellier.fr/images/formation"

# Suffixes
suffixes=("gba" "ig" "mat" "mea" "mi" "ste" "do " "egc" "msi" "se" )

# Loop through each suffix and download the corresponding image
for suffix in "${suffixes[@]}"; do
    # Construct the full URL
    url="${base_url}/${suffix}/logo${suffix}.png"
    
    # Download the image
    wget "$url" -O "logo${suffix}.png"
done

echo "Téléchargement terminé."
