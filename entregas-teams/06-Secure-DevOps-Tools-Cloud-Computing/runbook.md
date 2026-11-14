# Runbook — Secure DevOps Tools & Cloud Computing

## Escopo e limite de execução

Este runbook descreve verificações que a equipe pode executar. Os comandos abaixo
**não foram executados como CI nem contra uma conta cloud** nesta entrega: não há
resultado de CI, URL implantada, alerta ao vivo ou medição de uso a registrar.
Uma verificação local demonstra apenas o comportamento local; não comprova
deploy, disponibilidade externa, entrega de notificações ou custo.

## Pré-condições e segurança

- Execute os comandos a partir da raiz do repositório, em uma cópia revisada.
- Verifique Node.js 20+ e npm; para os serviços em contêiner, instale Docker
  Engine com Docker Compose.
- Para CI/deploy, confirme que a branch protegida, GitHub Actions, GHCR, OIDC e
  o ambiente cloud foram configurados e aprovados pela equipe responsável.
- Antes de qualquer `terraform apply` ou alteração de tráfego, aprove a região,
  retenção, orçamento, acesso, imagem imutável e procedimento de rollback.
- Use uma identidade individual/gerenciada com menor privilégio. Leia segredos
  de um cofre aprovado para a sessão ou do secret store do GitHub; não os
  coloque em arquivos versionados, argumentos de linha de comando, capturas,
  issues, logs ou mensagens. Não imprima variáveis secretas para “confirmar”
  que foram carregadas. Se um segredo aparecer em saída, pare, revogue/rotacione
  e trate a exposição como incidente.

## Verificação local (não é CI)

**Pré-condições:** raiz do repositório, Node.js 20+ e dependências instaláveis.
O teste focado verifica os CSVs e a ausência de valores semelhantes a
credenciais. O comando de raiz executa a suíte npm existente.

```powershell
npm ci
node --test .\06-Secure-DevOps-Tools-Cloud-Computing\test\docs.test.mjs
npm test
```

**Resultado esperado:** ambos os comandos de teste terminam com código zero. Se
o teste focado falhar, corrija os dados/estrutura ou remova qualquer valor
sensível antes de compartilhar os arquivos. Se `npm ci` falhar, confira versão
do Node, lockfile e conectividade; não substitua o lockfile por instalação não
reprodutível.

O Compose também exige `GRAFANA_ADMIN_PASSWORD` durante `config` porque valida
a interpolação do arquivo; antes do comando, carregue-o da fonte local aprovada
para a sessão, sem imprimir ou copiar o valor para o histórico. Não use senha
real de produção.

```powershell
docker compose -f .\06-Secure-DevOps-Tools-Cloud-Computing\compose.yaml config
```

**Resultado esperado:** configuração resolvida sem erro. Falhas de variável
obrigatória, YAML ou caminho devem ser corrigidas antes de `up`; não contorne
validações expondo portas ou removendo controles de segurança.

Para iniciar a stack local, mantenha essa variável disponível apenas na sessão;
o Compose não inicia Grafana se estiver ausente.

```powershell
docker compose -f .\06-Secure-DevOps-Tools-Cloud-Computing\compose.yaml up --build -d
docker compose -f .\06-Secure-DevOps-Tools-Cloud-Computing\compose.yaml ps
Invoke-RestMethod http://localhost:3000/api/health
(Invoke-WebRequest http://localhost:3000/metrics).Content
Invoke-RestMethod 'http://localhost:9090/api/v1/query?query=up%7Bjob%3D%22alerta-cidade%22%7D'
```

**Resultado esperado:** serviços indicados como em execução; health retorna
`status: ok` e `mode: demo`; `/metrics` inclui contadores e gauges do MVP; a
consulta Prometheus retorna `up` com valor `1`. A consulta representa apenas
scrape local. Serviço parado, health diferente de 200 ou `up=0` indica problema
de inicialização, rede ou scrape; inspecione `docker compose ... logs` e
corrija a causa, sem marcar isso como falha/alerta cloud.

Abra `http://localhost:9090/alerts` para observar o estado das regras carregadas
e `http://localhost:3001` para o dashboard Grafana. As regras e limites são
demonstrativos, não SLOs. O Compose não configura Alertmanager nem destinatário
de notificações: uma regra local não comprova envio de alerta ao vivo.
Para encerrar sem apagar os volumes nomeados:

```powershell
docker compose -f .\06-Secure-DevOps-Tools-Cloud-Computing\compose.yaml down
```

Não acrescente `-v` sem aprovação explícita e cópia/retensão dos dados locais.

## CI e implantação cloud

**Pré-condições antes de habilitar o deploy:**

1. Abra um pull request para `main`; confirme proteção/revisão da branch e
   Actions habilitado. O workflow `.github/workflows/devsecops.yml` dispara em
   pull request e em push para `main`.
2. Configure OIDC federado entre GitHub e Azure sem credencial de longa
   duração. Os nomes de secrets exigidos são `AZURE_CLIENT_ID`,
   `AZURE_TENANT_ID` e `AZURE_SUBSCRIPTION_ID`; as variables exigidas são
   `AZURE_RESOURCE_GROUP` e `AZURE_CONTAINER_APP`. Cadastre os valores somente
   no secret/variable store apropriado, nunca no YAML ou neste runbook.
3. Crie previamente a Container App, identidade e permissões mínimas, configure
   acesso de pull da imagem GHCR e verifique que a imagem por SHA ficará
   acessível ao runtime. O job de deploy atualiza uma app existente; não cria
   a infraestrutura e não executa Terraform.
4. Revise orçamento, localização de dados, limites e plano de retorno. Não
   aprove deploy se os recursos, permissões, state remoto ou imagem anterior
   conhecida não estiverem confirmados.

**Fluxo e observações esperadas:** em pull request, `security` executa `npm ci`,
testes, Gitleaks, Semgrep, Trivy de configuração e validação Terraform; `build`
constrói e varre a imagem sem publicá-la e deploy é ignorado. Depois do merge e
push em `main`, `build` publica a imagem identificada pelo SHA e a examina;
somente após sucesso, `deploy` autentica via OIDC e atualiza a Container App.
Confirme cada job e etapa na página da execução do GitHub Actions. Verde
significa apenas que aquelas etapas terminaram; o workflow não faz health check
pós-deploy nem comprova alerta ou custo.

**Falha/interpretação:** localize o primeiro job/step vermelho e preserve link,
SHA, horário e trecho sanitizado. Falha de teste requer correção e nova revisão;
achado de scanner exige triagem e correção, não desativar/ignorar o scanner;
falha Terraform pode ser sintaxe, provider, permissão ou configuração; falha
OIDC/`az containerapp update` exige verificar federação, RBAC, names/variables,
app existente e acesso à imagem. Não repita deploy às cegas nem copie tokens dos
logs. Se a implantação tiver sido iniciada e estiver degradada, siga a seção de
rollback.

O workflow só valida Terraform sem backend/state e **não provisiona** a
infraestrutura. Se a equipe aprovar um provisionamento separado, confirme
identidade cloud, região e orçamento, backend remoto Azure Storage existente,
state com acesso restrito/backup, variáveis obrigatórias
(`subscription_id`, `container_image`, `ingest_token`) e permissão para os
recursos. Confira também a variável Terraform `location`: há um default no
código que não equivale a uma região aprovada para implantação ou cotação; use
`TF_VAR_location` quando a decisão aprovada for diferente. Passe os nomes não
secretos do backend remoto ao `init`; não passe senhas, tokens ou chaves como
argumentos:

```powershell
terraform -chdir=.\06-Secure-DevOps-Tools-Cloud-Computing\terraform fmt -check -recursive
terraform -chdir=.\06-Secure-DevOps-Tools-Cloud-Computing\terraform init `
  -backend-config="resource_group_name=<grupo-do-state>" `
  -backend-config="storage_account_name=<storage-do-state>" `
  -backend-config="container_name=<container-do-state>" `
  -backend-config="key=<chave-do-state>"
terraform -chdir=.\06-Secure-DevOps-Tools-Cloud-Computing\terraform validate
terraform -chdir=.\06-Secure-DevOps-Tools-Cloud-Computing\terraform plan -out=approved.tfplan
terraform -chdir=.\06-Secure-DevOps-Tools-Cloud-Computing\terraform show approved.tfplan
```

Injete `TF_VAR_subscription_id`, `TF_VAR_container_image` e
`TF_VAR_ingest_token` na sessão por meio do mecanismo de segredos aprovado; não
crie `.tfvars` versionado. O state e o plano podem conter informação sensível:
proteja-os, não os anexe em logs/issues e remova o plano conforme a política
após a mudança. **Resultado esperado:** `fmt`, `init`, `validate` e `plan`
terminam sem erro; o plano mostra somente mudanças revisadas, sem remoção ou
substituição inesperada. Se faltar backend, lock, variável, permissão ou
recurso, pare e corrija com o responsável; não use backend local, force-unlock,
`-target` ou `destroy` como atalho. Só aplique o plano exato após aprovação:

```powershell
terraform -chdir=.\06-Secure-DevOps-Tools-Cloud-Computing\terraform apply approved.tfplan
terraform -chdir=.\06-Secure-DevOps-Tools-Cloud-Computing\terraform output -raw mvp_url
```

Confirme o endpoint usando o health check abaixo. Falha no apply exige preservar
o diagnóstico e reconciliar o state com o responsável antes de nova tentativa.
Para desfazer alteração de infraestrutura, faça mudança reversa revisada, gere
novo plano e aplique apenas após aprovação; nunca remova o backend/state.

Após uma execução aprovada, obtenha os dados reais sem os inventar:

```powershell
$resourceGroup = '<valor aprovado de AZURE_RESOURCE_GROUP>'
$containerApp = '<valor aprovado de AZURE_CONTAINER_APP>'
$appUrl = az containerapp show --resource-group $resourceGroup --name $containerApp --query 'properties.configuration.ingress.fqdn' --output tsv
Invoke-RestMethod "https://$appUrl/api/health"
```

**Resultado esperado:** FQDN retornado pela app e health `status: ok`. Registre
URL, SHA, data/hora e resultado somente depois da verificação real; caso
contrário deixe os campos pendentes. Não salve saída de comandos que possa
conter informação operacional sensível.

## Observabilidade e resposta a incidente

**Pré-condição:** identifique o ambiente (local ou cloud), a pessoa responsável,
o horário UTC de início e o canal de incidente aprovado. Não envie payloads,
tokens, dados pessoais ou logs brutos para canais públicos.

No ambiente local, use `/api/health`, `/metrics`, Prometheus em
`http://localhost:9090/alerts` e o dashboard Grafana em
`http://localhost:3001`. Métricas do MVP incluem requisições/erros, duração da
última requisição, uptime e RSS. A duração é da última requisição, não um
percentil nem SLO. As regras `MVPHighErrorRate` e `MVPUnavailable` são limites
demonstrativos e não indicam notificação configurada.

Em uma conta autorizada, colete o estado da app e uma janela curta de logs:

```powershell
az containerapp show --resource-group '<grupo aprovado>' --name '<app aprovada>' --query 'properties.provisioningState' --output tsv
az containerapp revision list --resource-group '<grupo aprovado>' --name '<app aprovada>' --output table
az containerapp logs show --resource-group '<grupo aprovado>' --name '<app aprovada>' --type console --tail 100
```

**Resultado esperado:** provisioning state `Succeeded`, revisão ativa
identificada e logs recentes sem falha repetida; compare o horário com o SHA
implantado e o health check. Erro de CLI/autorização é evidência insuficiente,
não prova de indisponibilidade. `Failed`/estado não saudável, erros persistentes
ou health fora de 200 requerem triagem, escalonamento ao responsável e
consideração de rollback. Sanitizem logs antes de anexar evidências.

**Passos de resposta:** (1) registre ambiente, UTC, SHA, impacto e sintomas sem
dados sensíveis; (2) verifique health, scrape e erros na janela; (3) compare
com a última mudança e estado da revisão; (4) contenha a mudança se houver
regressão ou risco de segredo; (5) faça rollback conforme abaixo quando
critérios forem atendidos; (6) valide health e alertas após a contenção; (7)
documente causa, ações, evidências redigidas e follow-up. Não gere carga para
forçar alertas em produção. Uma prova de notificação requer destinatário,
regra e execução autorizados; nenhum desses resultados está afirmado aqui.

## Rollback

**Critérios:** health falha após deploy, erros/impacto excedem os limites
aprovados, scanner/incidente revela risco material ou a equipe de plantão decide
conter. Obtenha aprovação do responsável e a imagem SHA conhecida como boa antes
de agir. Não use tag mutável como `latest`.

Para reimplantar uma imagem aprovada anterior, use uma identidade Azure
autorizada por RBAC (não uma credencial embutida):

```powershell
$resourceGroup = '<grupo aprovado>'
$containerApp = '<app aprovada>'
$knownGoodImage = 'ghcr.io/<owner>/<repository>:<sha-conhecido-bom>'
az containerapp update --resource-group $resourceGroup --name $containerApp --image $knownGoodImage
az containerapp show --resource-group $resourceGroup --name $containerApp --query 'properties.template.containers[0].image' --output tsv
```

**Resultado esperado:** imagem consultada corresponde exatamente ao SHA
aprovado; health volta a `status: ok` e erros estabilizam. Se atualizar falhar,
não destrua app/state: escale para o responsável cloud e siga o mecanismo
aprovado de recuperação. Em seguida abra PR de correção/reversão e preserve a
trilha de auditoria. Para regressão de código, prefira `git revert <sha>` em
branch e fluxo revisados, em vez de reescrever histórico compartilhado. Uma
reversão de Terraform exige `plan` revisado e aprovação; nunca rode `destroy`
nem apague o state como rollback.

## Custos, retenção e evidência

`docs/carga-sintetica.csv` contém apenas quantidades hipotéticas para tráfego,
retenção e computação; não são cotação, carga medida ou previsão de fatura.
Antes de estimar, a equipe deve aprovar provedor, região, desenho e retenção.
Depois, consultar a página oficial de preços/calculadora do provedor para cada
SKU e região efetivamente escolhidos, registrar URL oficial e data de consulta,
moeda, unidade de cobrança, configuração e premissas, e recalcular para cada
perfil sem misturar isso com uso medido. Após deploy, preencher uso real a
partir de métricas/faturamento do período observado, guardar janela/fonte e
separá-lo das premissas. Não preencha campos vazios por inferência.

## Segredos e rotação

Se um segredo for compartilhado, aparecer no Git ou em log: interrompa a
distribuição, revogue/rotacione no sistema emissor, remova-o de versões futuras
e do histórico seguindo a política do repositório, revise acessos/execuções e
registre o incidente sem copiar o valor exposto. Confirme a nova credencial por
metadados não secretos; nunca cole seu conteúdo em evidência. Use OIDC para CI,
secret stores para tokens e RBAC mínimo; `.tfvars`, state e dumps devem
permanecer fora do Git e com controles de acesso/backups apropriados.
