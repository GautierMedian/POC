# Helm Chart pour CSV Mapper

Ce chart Helm déploie l'application Angular CSV Mapper sur Kubernetes.

## Prérequis

- Kubernetes 1.24+
- Helm 3.8+
- kubectl configuré pour votre cluster

## Installation

### 1. Construire l'image Docker

```bash
# Depuis la racine du projet
docker build -t csv-mapper:latest .
```

Si vous utilisez un registry privé :

```bash
docker build -t myregistry.com/csv-mapper:latest .
docker push myregistry.com/csv-mapper:latest
```

### 2. Installer le chart

Installation avec les valeurs par défaut :

```bash
helm install csv-mapper ./helm/csv-mapper
```

Installation avec des valeurs personnalisées :

```bash
helm install csv-mapper ./helm/csv-mapper \
  --set image.repository=myregistry.com/csv-mapper \
  --set image.tag=1.0.0 \
  --set replicaCount=3
```

Installation avec ingress activé :

```bash
helm install csv-mapper ./helm/csv-mapper \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=csv-mapper.example.com \
  --set ingress.hosts[0].paths[0].path=/ \
  --set ingress.hosts[0].paths[0].pathType=Prefix
```

### 3. Vérifier le déploiement

```bash
# Vérifier les pods
kubectl get pods -l app.kubernetes.io/name=csv-mapper

# Vérifier les services
kubectl get svc -l app.kubernetes.io/name=csv-mapper

# Voir les logs
kubectl logs -l app.kubernetes.io/name=csv-mapper --tail=50
```

## Configuration

Les paramètres suivants peuvent être configurés dans `values.yaml` :

| Paramètre | Description | Valeur par défaut |
|-----------|-------------|-------------------|
| `replicaCount` | Nombre de replicas | `2` |
| `image.repository` | Repository de l'image Docker | `csv-mapper` |
| `image.tag` | Tag de l'image | `latest` |
| `image.pullPolicy` | Pull policy | `IfNotPresent` |
| `service.type` | Type de service Kubernetes | `ClusterIP` |
| `service.port` | Port du service | `80` |
| `ingress.enabled` | Activer l'ingress | `false` |
| `resources.limits.cpu` | Limite CPU | `200m` |
| `resources.limits.memory` | Limite mémoire | `256Mi` |
| `autoscaling.enabled` | Activer l'autoscaling | `false` |

## Mise à jour

```bash
# Mettre à jour avec une nouvelle version
helm upgrade csv-mapper ./helm/csv-mapper \
  --set image.tag=2.0.0

# Avec un fichier de valeurs personnalisé
helm upgrade csv-mapper ./helm/csv-mapper \
  -f custom-values.yaml
```

## Désinstallation

```bash
helm uninstall csv-mapper
```

## Accès à l'application

### Avec ClusterIP (par défaut)

```bash
kubectl port-forward svc/csv-mapper 8080:80
# Accéder à http://localhost:8080
```

### Avec Ingress

Configurez un ingress controller et accédez via le nom de domaine configuré.

## Développement

### Test en local avec Minikube

```bash
# Démarrer Minikube
minikube start

# Utiliser le daemon Docker de Minikube
eval $(minikube docker-env)

# Construire l'image
docker build -t csv-mapper:latest .

# Installer le chart
helm install csv-mapper ./helm/csv-mapper \
  --set image.pullPolicy=Never

# Accéder à l'application
minikube service csv-mapper
```

### Validation du chart

```bash
# Vérifier la syntaxe
helm lint ./helm/csv-mapper

# Afficher les templates rendus
helm template csv-mapper ./helm/csv-mapper

# Dry-run de l'installation
helm install csv-mapper ./helm/csv-mapper --dry-run --debug
```

## Production

Pour un déploiement en production, considérez :

1. **Image registry** : Utilisez un registry privé
2. **Ressources** : Ajustez les limites CPU/mémoire selon vos besoins
3. **Autoscaling** : Activez le HPA pour gérer la charge
4. **Ingress** : Configurez HTTPS avec cert-manager
5. **Monitoring** : Ajoutez des annotations Prometheus si nécessaire
6. **Affinity** : Configurez l'anti-affinity pour la haute disponibilité

Exemple de configuration production :

```yaml
# production-values.yaml
replicaCount: 3

image:
  repository: myregistry.com/csv-mapper
  tag: "1.0.0"
  pullPolicy: Always

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: csv-mapper.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: csv-mapper-tls
      hosts:
        - csv-mapper.example.com

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

Déploiement :

```bash
helm install csv-mapper ./helm/csv-mapper -f production-values.yaml
```
