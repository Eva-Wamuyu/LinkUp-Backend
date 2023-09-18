import pandas as pd
import matplotlib.pyplot as plt


file= './data.csv' 
df = pd.read_csv(file)


mean_metrics = df.groupby('metric_name')['metric_value'].mean().reset_index()


plt.figure(figsize=(12, 6))
plt.bar(mean_metrics['metric_name'], mean_metrics['metric_value'])
plt.xlabel('Metric Name')
plt.ylabel('Mean Metric Value')
plt.title('Mean Metric Values')
plt.xticks(rotation=90) 
plt.tight_layout()


plt.show()
