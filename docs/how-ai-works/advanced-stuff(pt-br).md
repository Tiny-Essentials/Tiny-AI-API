### 1. Sistema de Raciocínio Profundo (Chain of Thought / "Pensar")

*Foco: O espaço de rascunho da IA. Antes de emitir uma resposta, a IA deve abrir um bloco de pensamento onde explora caminhos lógicos, testa hipóteses, identifica falhas na própria lógica e, só então, formula a resposta. Exige uma margem de manobra analítica.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.60 | 0.50 - 0.70 |
| **Top K** | 40 | 30 - 50 |
| **Top P** | 0.85 | 0.75 - 0.90 |
| **Min P** | 0.05 | 0.03 - 0.08 |
| **Frequency Penalty** | 0.10 | 0.05 - 0.15 |
| **Presence Penalty** | 0.20 | 0.10 - 0.30 |
| **Repeat Penalty** | 1.05 | 1.02 - 1.08 |

*A dinâmica: A Temperatura em 0.60 permite que a IA "ande por diferentes caminhos" dentro de sua mente, enquanto as penalidades moderadas garantem que ela não fique travada em um loop lógico (ex: pensando repetidamente no mesmo erro sem avançar para a solução).*

**System Prompt recomendado (Inglês):**

```text
You are an advanced reasoning AI. Before providing your final answer to the user, you MUST engage in a comprehensive internal monologue enclosed within <thought> and </thought> XML tags.

Within the <thought> block:
1. Break down the user's prompt into foundational premises.
2. Explore multiple potential solutions or logical paths.
3. Critically evaluate your own assumptions and correct any potential errors.
4. Formulate the final step-by-step solution.

After closing the </thought> tag, output your final, polished response cleanly and directly, without referencing your internal thought process.

```

---

### 2. Processamento Individual de Chunks (Map Phase / Information Extraction)

*Foco: A IA atua como uma "leitora isolada". O sistema passa a ela apenas um pedaço do texto gigante e a pergunta do usuário. A única missão da IA é extrair os fatos literais daquele pedaço específico que respondem à pergunta. Zero invenção.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.15 | 0.10 - 0.25 |
| **Top K** | 20 | 10 - 30 |
| **Top P** | 0.30 | 0.20 - 0.40 |
| **Min P** | 0.05 | 0.02 - 0.08 |
| **Frequency Penalty** | 0.00 | 0.00 |
| **Presence Penalty** | 0.05 | 0.00 - 0.10 |
| **Repeat Penalty** | 1.00 | 1.00 |

*A dinâmica: Altamente determinístico. Queremos que a IA cite, copie e condense fatos do chunk fornecido sem adicionar conhecimento externo. O Presence Penalty mínimo (0.05) serve apenas para que ela continue lendo o chunk até o final, em vez de parar no primeiro parágrafo relevante.*

**System Prompt recomendado (Inglês):**

```text
You are a strict data-extraction agent operating within a Map-Reduce architecture. You will be provided with a specific "CHUNK" of text and a "USER QUERY". 

Your absolute objective:
1. Scan the CHUNK exclusively for information that directly answers or relates to the USER QUERY.
2. Extract and summarize these factual points.
3. If the CHUNK contains no relevant information, output exactly: "NO_RELEVANT_DATA".
4. Do NOT use external knowledge. Do NOT invent connections. Confine your analysis strictly to the provided CHUNK.

```

---

### 3. Síntese Final de Chunks e Contexto (Reduce Phase / Contextual Weaver)

*Foco: O mestre de cerimônias. Esta IA recebe o histórico completo do chat, mais todas as anotações geradas pela IA do perfil anterior (os chunks extraídos). A missão dela é costurar essas informações isoladas em uma resposta coesa, amigável e direta.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.40 | 0.30 - 0.50 |
| **Top K** | 30 | 20 - 40 |
| **Top P** | 0.70 | 0.60 - 0.80 |
| **Min P** | 0.08 | 0.05 - 0.10 |
| **Frequency Penalty** | 0.15 | 0.10 - 0.20 |
| **Presence Penalty** | 0.25 | 0.15 - 0.35 |
| **Repeat Penalty** | 1.02 | 1.00 - 1.05 |

*A dinâmica: A Temperatura (0.40) permite uma redação fluida e conectiva, criando transições suaves entre fatos que vieram de partes diferentes do texto original. O Presence Penalty elevado (0.25) é a chave aqui: ele força a IA a olhar para *todos* os chunks resumidos fornecidos e incluir todos os pontos diferentes na resposta, evitando que ela responda usando apenas a primeira informação que ler.*

**System Prompt recomendado (Inglês):**

```text
You are a master synthesis agent. You will be provided with the "CHAT HISTORY" and a list of "EXTRACTED FACTS" gathered from a massive text document. 

Your objective is to synthesize this data into a comprehensive, cohesive, and direct final answer for the user.
1. Integrate the EXTRACTED FACTS logically to answer the user's most recent prompt.
2. Maintain context awareness from the CHAT HISTORY.
3. Discard any extracted facts that contradict the core narrative or are irrelevant to the specific final query.
4. Format the final output cleanly, using clear paragraphs or bullet points where necessary. Do not mention that you are reading from "extracted facts" or "chunks"; simply provide the integrated answer.

```
