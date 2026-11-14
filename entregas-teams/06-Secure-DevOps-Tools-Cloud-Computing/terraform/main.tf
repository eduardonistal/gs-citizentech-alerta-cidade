variable "location" {
  type        = string
  description = "Região Azure escolhida após avaliar latência e custo."
  default     = "brazilsouth"
}

variable "subscription_id" {
  type        = string
  description = "Azure subscription ID fornecido pelo ambiente de implantação."
}

variable "resource_group_name" {
  type        = string
  description = "Grupo de recursos isolado para a GS."
  default     = "rg-gs-alerta-cidade"
}

variable "container_image" {
  type        = string
  description = "Imagem versionada em registry público ou autenticado."
}

variable "ingest_token" {
  type        = string
  description = "Token de ingestão do n8n; fornecer via TF_VAR_ingest_token fora do repositório."
  sensitive   = true
}

resource "azurerm_resource_group" "gs" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_log_analytics_workspace" "gs" {
  name                = "law-gs-alerta-cidade"
  location            = azurerm_resource_group.gs.location
  resource_group_name = azurerm_resource_group.gs.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "gs" {
  name                       = "cae-gs-alerta-cidade"
  location                   = azurerm_resource_group.gs.location
  resource_group_name        = azurerm_resource_group.gs.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.gs.id
}

resource "azurerm_container_app" "mvp" {
  name                         = "ca-gs-alerta-cidade"
  container_app_environment_id = azurerm_container_app_environment.gs.id
  resource_group_name          = azurerm_resource_group.gs.name
  revision_mode                = "Single"

  secret {
    name  = "gs-ingest-token"
    value = var.ingest_token
  }

  template {
    min_replicas = 1
    max_replicas = 2
    container {
      name   = "mvp"
      image  = var.container_image
      cpu    = 0.25
      memory = "0.5Gi"
      env {
        name  = "PORT"
        value = "3000"
      }
      env {
        name        = "GS_INGEST_TOKEN"
        secret_name = "gs-ingest-token"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    transport        = "auto"
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

output "mvp_url" {
  value       = "https://${azurerm_container_app.mvp.ingress[0].fqdn}"
  description = "URL pública HTTPS do MVP após aplicação do Terraform."
}
