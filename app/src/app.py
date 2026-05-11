from flask import Flask, jsonify
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
metrics = PrometheusMetrics(app)

@app.route('/')
def home():
    return jsonify({
        "app": "DeployWatch",
        "status": "running",
        "message": "Automated deployment and monitoring system - v3.0 Live - Faizan"
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy"
    })

@app.route('/info')
def info():
    return jsonify({
        "app": "DeployWatch",
        "version": "1.0.0",
        "description": "Automated deployment and monitoring system",
        "tech_stack": ["Flask", "Kubernetes", "ArgoCD", "Prometheus", "Grafana"]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)