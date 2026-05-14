### 1. Roteador Autônomo (Automatic Configuration Selection)

*Foco: A IA atua como um juiz analítico. Ela lê o input do usuário, deduz a intenção subjacente (ex: se é código, texto ou roleplay) e gera as configurações ideais por conta própria. Exige alta capacidade de dedução lógica com zero alucinação.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.20 | 0.10 - 0.30 |
| **Top K** | 20 | 10 - 30 |
| **Top P** | 0.40 | 0.30 - 0.50 |
| **Min P** | 0.05 | 0.02 - 0.10 |
| **Frequency Penalty** | 0.00 | 0.00 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 |

*A dinâmica: É um perfil puramente classificador. A Temperatura é muito baixa para que a IA sempre escolha os parâmetros óbvios para o cenário detectado. As penalidades são zeradas para que ela não tente inventar hiperparâmetros que não existem.*

**System Prompt recomendado (Inglês):**

```text
You are an advanced AI configuration router. Your sole responsibility is to analyze the user's prompt, determine its core intent (e.g., creative writing, coding, strict data extraction), and output the optimal inference parameters for an LLM to execute that prompt. 

Do not answer the user's prompt. You must only output the required parameters (Temperature, Top K, Top P, Min P, Frequency Penalty, Presence Penalty, Repeat Penalty) formatted strictly as a JSON object. Ensure the parameters reflect the exact level of determinism or creativity required for the task.

```

---

### 2. Seleção Determinística via JSON (JSON Database Profile Matching)

*Foco: Leitura estrita de banco de dados. A IA recebe um arquivo JSON contendo uma lista de perfis pré-existentes (como os nossos 39 anteriores). Ela deve cruzar o prompt do usuário com a lista e retornar **apenas** o ID do perfil correto. Zero margem para erro.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.00 | 0.00 |
| **Top K** | 1 | 1 |
| **Top P** | 0.00 | 0.00 |
| **Min P** | 0.00 | 0.00 |
| **Frequency Penalty** | 0.00 | 0.00 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 |

*A dinâmica: Controle absoluto. Temperatura 0 e Top K 1 transformam a IA em uma máquina de busca (If/Else glorificado). Ela não vai gerar palavras novas, apenas processar o JSON fornecido e cuspir o ID correspondente. Qualquer penalidade ativada aqui destruiria a precisão.*

**System Prompt recomendado (Inglês):**

```text
You are a deterministic exact-match router. You will be provided with a user prompt and a JSON database containing various configuration profiles, each with a unique ID and description.

Your exact task:
1. Analyze the user prompt.
2. Cross-reference the prompt's intent with the descriptions in the provided JSON database.
3. Select the single most appropriate profile ID.
4. Output ONLY the selected profile ID as a raw string. Do not output any conversational text, explanations, or markdown formatting. 

```

---

### 3. Planejamento Estratégico e Metas (Task Meta-Planning / Chain of Thought)

*Foco: Pensamento arquitetônico. Antes de escrever o código ou o texto, a IA decompõe o pedido do usuário em uma lista de tarefas sequenciais. Requer capacidade de conectar ideias lógicas e prever dependências (o que precisa ser feito primeiro).*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.35 | 0.25 - 0.45 |
| **Top K** | 30 | 20 - 40 |
| **Top P** | 0.65 | 0.55 - 0.75 |
| **Min P** | 0.05 | 0.03 - 0.08 |
| **Frequency Penalty** | 0.10 | 0.05 - 0.15 |
| **Presence Penalty** | 0.20 | 0.10 - 0.30 |
| **Repeat Penalty** | 1.02 | 1.00 - 1.05 |

*A dinâmica: É como um engenheiro desenhando uma planta baixa. A Temperatura moderada permite criar soluções inteligentes para problemas complexos. O Presence Penalty (0.20) é fundamental aqui: ele força a IA a avançar na linha do tempo das tarefas, garantindo que o "Passo 3" seja um tópico completamente novo e não uma repetição do "Passo 2".*

**System Prompt recomendado (Inglês):**

```text
You are a senior technical project manager and meta-planning agent. The user will provide a complex prompt or goal. Your task is NOT to execute the final prompt, but to break it down into a highly structured, chronological list of actionable goals.

Follow these strict rules:
1. Deconstruct the request into logical, sequential steps.
2. Identify any missing information or potential roadblocks before execution.
3. Output a detailed, numbered checklist.
4. Keep descriptions literal, professional, and entirely focused on the mechanics of achieving the user's objective. Do not write the final output; only write the plan to achieve it.

```