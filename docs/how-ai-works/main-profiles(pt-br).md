### 1. O Padrão Neutro (Baseline Default)

*Foco: É a "prancheta em branco". A configuração original da maioria das APIs antes de qualquer ajuste humano. Serve como ponto de partida para testar como um modelo se comporta puramente com base no seu treinamento original.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 1.00 | 1.00 |
| **Top K** | 0 (ou Desativado) | 0 - 50 |
| **Top P** | 1.00 | 1.00 |
| **Min P** | 0.00 | 0.00 |
| **Frequency Penalty** | 0.00 | 0.00 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 |
| *A dinâmica: Nenhuma penalidade, nenhuma restrição (além da temperatura em 1.0 que mantém a probabilidade matemática natural). Se a resposta da IA for ruim neste perfil, o problema geralmente está no prompt, não nos parâmetros.* |  |  |

### 2. Determinismo Absoluto (Greedy Decoding Puro)

*Foco: O arquétipo fundador de tarefas de lógica, código e matemática. A IA perde 100% de sua capacidade de "escolha livre" e é forçada a pegar sempre o caminho matematicamente mais provável, palavra por palavra.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.00 | 0.00 |
| **Top K** | 1 | 1 |
| **Top P** | 0.00 | 0.00 |
| **Min P** | 0.00 | 0.00 |
| **Frequency Penalty** | 0.00 | 0.00 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 |
| *A dinâmica: Se você rodar o mesmo prompt 1.000 vezes, obterá exatamente a mesma resposta 1.000 vezes. É o teste definitivo de sanidade de dados.* |  |  |

### 3. Alta Confiança / Ancoragem Factual (High Confidence)

*Foco: O arquétipo fundador do RAG, respostas a perguntas e análises de texto. Ele não é totalmente determinístico (para não ficar robótico), mas corta impiedosamente as opções de palavras que a IA não tem certeza.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.30 | 0.20 - 0.40 |
| **Top K** | 20 | 10 - 30 |
| **Top P** | 0.50 | 0.40 - 0.60 |
| **Min P** | 0.10 | 0.05 - 0.15 |
| **Frequency Penalty** | 0.00 | 0.00 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 |
| *A dinâmica: Ao forçar o `Top P` para 0.50 e o `Min P` para 0.10, estamos dizendo à IA: "Só me mostre a palavra se ela estiver na metade superior das probabilidades e se for pelo menos 10% tão boa quanto a melhor opção".* |  |  |

### 4. Expansão Estrutural / Anti-Loop

*Foco: O arquétipo usado exclusivamente para resolver problemas de IAs que ficam repetindo a mesma frase ou estrutura infinitamente. É a base das penalidades usadas em Roleplay e Escrita.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.60 | 0.50 - 0.70 |
| **Top K** | 40 | 30 - 50 |
| **Top P** | 0.85 | 0.80 - 0.90 |
| **Min P** | 0.05 | 0.02 - 0.05 |
| **Frequency Penalty** | 0.60 | 0.50 - 0.80 |
| **Presence Penalty** | 0.60 | 0.50 - 0.80 |
| **Repeat Penalty** | 1.15 | 1.10 - 1.20 |
| *A dinâmica: A temperatura é mantida média para não gerar caos, mas as penalidades estão no máximo recomendável antes de quebrar a gramática. Se um modelo está travado repetindo "ele olhou para ela e sorriu", essa configuração o obriga fisicamente a procurar outras ações.* |  |  |

### 5. Caos Controlado / Teste de Limites (Maximum Entropy)

*Foco: O arquétipo fundador do Brainstorming extremo. Ele empurra o modelo até o limite de sua capacidade linguística antes de começar a falar palavras sem sentido (o que chamamos de degradação semântica).*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 1.40 | 1.20 - 1.50 |
| **Top K** | 80 | 60 - 100 |
| **Top P** | 0.98 | 0.95 - 1.00 |
| **Min P** | 0.01 | 0.01 - 0.02 |
| **Frequency Penalty** | 0.30 | 0.20 - 0.40 |
| **Presence Penalty** | 0.30 | 0.20 - 0.40 |
| **Repeat Penalty** | 1.05 | 1.02 - 1.08 |
| *A dinâmica: Acima de 1.50 de temperatura na maioria dos modelos, a IA começa a perder a capacidade de formar frases coerentes. Este perfil explora esse limite, forçando associações de ideias muito distantes umas das outras.* |  |  |
