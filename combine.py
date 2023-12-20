import os
import pandas as pd

folder_path = 'Data'

csv_files = [f for f in os.listdir(folder_path) if f.endswith('.csv')]

# Initialize an empty DataFrame to store the combined data
combined_df = pd.DataFrame()

# Iterate through each CSV file and concatenate its data
for csv_file in csv_files:
    file_path = os.path.join(folder_path, csv_file)
    df = pd.read_csv(file_path)
    combined_df = pd.concat([combined_df, df], ignore_index=True)

# Save the combined DataFrame to a new CSV file
combined_df.to_csv('data.csv', index=False)

print("Combined CSV file has been created: combined_data.csv")