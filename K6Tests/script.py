import pandas as pd
import matplotlib.pyplot as plt


file= './data.csv' 
df = pd.read_csv(file)


mean_metrics = df.groupby('metric_name')['metric_value'].mean().reset_index()
metric_data = df[['metric_name', 'timestamp', 'metric_value']]

# plt.figure(figsize=(12, 6))
# plt.bar(mean_metrics['metric_name'], mean_metrics['metric_value'])
# plt.xlabel('Metric Name')
# plt.ylabel('Mean Metric Value')
# plt.title('Mean Metric Values')
# plt.xticks(rotation=90) 
# plt.tight_layout()

plt.figure(figsize=(12, 6))

for metric_name, data_group in metric_data.groupby('metric_name'):
    plt.plot(data_group['timestamp'], data_group['metric_value'], label=metric_name)

plt.xlabel('Timestamp')
plt.ylabel('Metric Value')
plt.title('Line Graphs of Metrics')
plt.legend()
plt.grid(True)

plt.show()
plt.show()
