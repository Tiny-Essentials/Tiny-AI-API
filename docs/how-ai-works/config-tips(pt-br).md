### 1. Roleplay

*Foco: Alta criatividade, imprevisibilidade controlada, manutenção da personalidade e forte penalidade para evitar que a IA repita os mesmos trejeitos ou ações.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.85 | 0.70 - 1.10 |
| **Top K** | 40 | 30 - 50 |
| **Top P** | 0.90 | 0.85 - 0.95 |
| **Min P** | 0.05 | 0.02 - 0.10 |
| **Frequency Penalty** | 0.20 | 0.10 - 0.40 |
| **Presence Penalty** | 0.40 | 0.30 - 0.60 |
| **Repeat Penalty** | 1.10 | 1.05 - 1.15 |

### 2. Conversas Normais

*Foco: Diálogo natural e equilibrado. A IA deve soar humana, mas manter a coesão sem devaneios excessivos.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.70 | 0.60 - 0.80 |
| **Top K** | 40 | 30 - 50 |
| **Top P** | 0.90 | 0.80 - 0.95 |
| **Min P** | 0.05 | 0.05 - 0.10 |
| **Frequency Penalty** | 0.10 | 0.00 - 0.20 |
| **Presence Penalty** | 0.10 | 0.00 - 0.20 |
| **Repeat Penalty** | 1.05 | 1.00 - 1.10 |

### 3. Responder Perguntas

*Foco: Foco absoluto nos fatos e redução drástica de alucinações. Respostas diretas e objetivas.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.20 | 0.10 - 0.30 |
| **Top K** | 20 | 10 - 30 |
| **Top P** | 0.50 | 0.40 - 0.70 |
| **Min P** | 0.10 | 0.05 - 0.15 |
| **Frequency Penalty** | 0.00 | 0.00 - 0.10 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 - 1.02 |

### 4. Conversar sobre um Assunto Específico

*Foco: Manter a coerência dentro de um domínio delimitado, permitindo leve criatividade para explorar nuances do tema.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.40 | 0.30 - 0.50 |
| **Top K** | 30 | 20 - 40 |
| **Top P** | 0.70 | 0.60 - 0.80 |
| **Min P** | 0.08 | 0.05 - 0.10 |
| **Frequency Penalty** | 0.10 | 0.00 - 0.20 |
| **Presence Penalty** | 0.10 | 0.00 - 0.20 |
| **Repeat Penalty** | 1.05 | 1.00 - 1.08 |

### 5. Conversar sobre um Livro ou Conteúdo Grande (RAG)

*Foco: Ancoragem rigorosa no contexto fornecido no prompt. A IA não deve inventar eventos que não estão no material de referência.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.15 | 0.10 - 0.25 |
| **Top K** | 20 | 10 - 30 |
| **Top P** | 0.40 | 0.30 - 0.50 |
| **Min P** | 0.10 | 0.05 - 0.15 |
| **Frequency Penalty** | 0.05 | 0.00 - 0.10 |
| **Presence Penalty** | 0.00 | 0.00 - 0.10 |
| **Repeat Penalty** | 1.02 | 1.00 - 1.05 |

### 6. Programação

*Foco: Sintaxe estrita, zero alucinação criativa. Penalidades de repetição devem ser mantidas desativadas para não quebrar a indentação ou variáveis com nomes semelhantes.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.10 | 0.00 - 0.20 |
| **Top K** | 10 | 0 - 20 |
| **Top P** | 0.10 | 0.05 - 0.20 |
| **Min P** | 0.05 | 0.00 - 0.10 |
| **Frequency Penalty** | 0.00 | 0.00 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 |

### 7. Análise e Correção de Texto

*Foco: Preservar o tom original do usuário o máximo possível, alterando apenas gramática, ortografia ou estrutura técnica recomendada.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.20 | 0.10 - 0.30 |
| **Top K** | 20 | 10 - 30 |
| **Top P** | 0.50 | 0.40 - 0.60 |
| **Min P** | 0.05 | 0.05 - 0.10 |
| **Frequency Penalty** | 0.00 | 0.00 - 0.05 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 - 1.02 |

### 8. Geração de Lore / Brainstorming Criativo

*Foco: Divergência máxima de ideias, conexões inusitadas e vocabulário rico. Penalidades altas para forçar a IA a buscar conceitos novos.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 1.10 | 0.90 - 1.30 |
| **Top K** | 60 | 50 - 100 |
| **Top P** | 0.95 | 0.90 - 1.00 |
| **Min P** | 0.02 | 0.01 - 0.05 |
| **Frequency Penalty** | 0.30 | 0.20 - 0.50 |
| **Presence Penalty** | 0.50 | 0.40 - 0.80 |
| **Repeat Penalty** | 1.15 | 1.10 - 1.25 |

### 9. Extração de Dados e Retorno em JSON

*Foco: Determinismo absoluto. A IA deve sempre retornar a mesma estrutura exata de dados para uma mesma entrada, sem adicionar texto extra.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.00 | 0.00 |
| **Top K** | 1 | 1 |
| **Top P** | 0.00 | 0.00 |
| **Min P** | 0.00 | 0.00 |
| **Frequency Penalty** | 0.00 | 0.00 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 |

### 10. Tradução de Textos

*Foco: Fidelidade estrita ao significado original, mas com uma leve margem para adaptar expressões idiomáticas e manter a fluidez natural no idioma de destino.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.30 | 0.20 - 0.40 |
| **Top K** | 30 | 20 - 40 |
| **Top P** | 0.70 | 0.50 - 0.80 |
| **Min P** | 0.05 | 0.05 - 0.10 |
| **Frequency Penalty** | 0.00 | 0.00 - 0.10 |
| **Presence Penalty** | 0.00 | 0.00 - 0.05 |
| **Repeat Penalty** | 1.02 | 1.00 - 1.05 |

### 11. Resumo de Textos (Summarization)

*Foco: Concisão e captura dos pontos-chave. A penalidade de presença é levemente elevada para encorajar a IA a avançar nos tópicos em vez de ficar repetindo o mesmo argumento principal.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.30 | 0.20 - 0.40 |
| **Top K** | 30 | 20 - 40 |
| **Top P** | 0.60 | 0.50 - 0.70 |
| **Min P** | 0.08 | 0.05 - 0.10 |
| **Frequency Penalty** | 0.20 | 0.10 - 0.30 |
| **Presence Penalty** | 0.20 | 0.10 - 0.30 |
| **Repeat Penalty** | 1.05 | 1.02 - 1.08 |

---

### 12. Geração de Prompts Estruturados (Artes Visuais e Música)

*Foco: Mistura de precisão técnica com vocabulário evocativo. Ideal para gerar comandos detalhados para outras IAs (como descrever a estética de personagens em escalas específicas ou estruturar as camadas de uma trilha sonora de boss theme com rock gótico e orquestra).*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.75 | 0.65 - 0.85 |
| **Top K** | 40 | 30 - 50 |
| **Top P** | 0.85 | 0.80 - 0.90 |
| **Min P** | 0.05 | 0.02 - 0.08 |
| **Frequency Penalty** | 0.10 | 0.00 - 0.20 |
| **Presence Penalty** | 0.20 | 0.10 - 0.30 |
| **Repeat Penalty** | 1.05 | 1.00 - 1.08 |
| *A dinâmica: A IA precisa ter liberdade para usar adjetivos ricos, mas não pode divagar a ponto de esquecer as restrições técnicas do prompt (como iluminação, estilo ou instrumentos musicais específicos como solos de violino).* |  |  |

### 13. Escrita de Roteiros e Scripts de Diálogo

*Foco: Manter a voz individual dos personagens, respeitando regras de anatomia ou de universo, enquanto avança o enredo de forma fluida e sem travar a cena.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.80 | 0.70 - 0.90 |
| **Top K** | 50 | 40 - 60 |
| **Top P** | 0.90 | 0.85 - 0.95 |
| **Min P** | 0.05 | 0.03 - 0.08 |
| **Frequency Penalty** | 0.25 | 0.15 - 0.35 |
| **Presence Penalty** | 0.40 | 0.30 - 0.50 |
| **Repeat Penalty** | 1.08 | 1.05 - 1.12 |
| *A dinâmica: Penalidades de presença mais altas forçam os personagens a tomarem novas ações e discutirem novos tópicos, evitando diálogos circulares.* |  |  |

### 14. Documentação Técnica e READMEs

*Foco: Clareza instrucional com um tom amigável e acessível. A IA deve manter o texto equilibrado e profissional, mas com uma leveza sutil — divertido, porém sem soar descolado demais ou informal em excesso.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.40 | 0.30 - 0.50 |
| **Top K** | 30 | 20 - 40 |
| **Top P** | 0.65 | 0.50 - 0.75 |
| **Min P** | 0.05 | 0.05 - 0.10 |
| **Frequency Penalty** | 0.10 | 0.00 - 0.15 |
| **Presence Penalty** | 0.10 | 0.00 - 0.15 |
| **Repeat Penalty** | 1.02 | 1.00 - 1.05 |
| *A dinâmica: Restringimos a criatividade para focar puramente em explicar como módulos e bibliotecas funcionam, garantindo que os tutoriais não contenham passos inventados.* |  |  |

### 15. Otimização e Refatoração de Código

*Foco: Reescrita lógica e estrita de scripts existentes. A IA deve focar inteiramente em criar funções reutilizáveis, templates eficientes e evitar qualquer repetição de fórmulas, reduzindo o tamanho final do código.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.15 | 0.05 - 0.20 |
| **Top K** | 15 | 10 - 20 |
| **Top P** | 0.20 | 0.10 - 0.30 |
| **Min P** | 0.05 | 0.02 - 0.05 |
| **Frequency Penalty** | 0.00 | 0.00 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 |
| *A dinâmica: Quase tão determinístico quanto a extração de JSON. Penalidades zeradas são obrigatórias para que a IA não tente usar nomes de variáveis diferentes só para "variar o vocabulário", quebrando a sintaxe do projeto.* |  |  |

### 16. Geração de Dados Fictícios (Mock Data / Seeders)

*Foco: Criação de volumes massivos de dados estruturados para popular bancos de dados em fase de testes, mantendo a variedade e o realismo sem repetição excessiva.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.90 | 0.80 - 1.00 |
| **Top K** | 50 | 40 - 60 |
| **Top P** | 0.95 | 0.90 - 1.00 |
| **Min P** | 0.05 | 0.02 - 0.08 |
| **Frequency Penalty** | 0.40 | 0.30 - 0.50 |
| **Presence Penalty** | 0.50 | 0.40 - 0.60 |
| **Repeat Penalty** | 1.10 | 1.05 - 1.15 |
| *A dinâmica: Diferente do JSON determinístico, aqui queremos variedade. A alta temperatura e penalidades fortes garantem que a IA gere 50 perfis de usuários, itens ou logs totalmente diferentes uns dos outros, sem repetir nomes ou características.* |  |  |

### 17. Geração de JSON de MIDI (Estruturas Musicais)

*Foco: É uma mistura perigosa entre código estrito e dados artísticos. A estrutura JSON não pode quebrar de forma alguma, mas a IA precisa de uma levíssima margem para calcular tempos (ticks), durações e velocidades de notas com alguma musicalidade (como as variações de intensidade em um solo de violino, por exemplo).*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.15 | 0.10 - 0.20 |
| **Top K** | 15 | 10 - 20 |
| **Top P** | 0.25 | 0.15 - 0.35 |
| **Min P** | 0.05 | 0.02 - 0.05 |
| **Frequency Penalty** | 0.00 | 0.00 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 |
| *A dinâmica: Quase idêntico à programação pura, mas com uma temperatura microscópica e um Top P levemente maior para permitir que a IA escolha valores numéricos diferentes para a dinâmica das notas, mantendo as penalidades em zero absoluto para não corromper os arrays e chaves do JSON.* |  |  |

### 18. Criação de Prompts para Geração de Imagens (Stable Diffusion / InvokeAI)

*Foco: Linguagem baseada em tags ou descrições ricas, sem conectivos desnecessários. A IA deve focar em peso visual, paletas de cores específicas (como olhos rosa choque ou pelagens brancas) e detalhes precisos de composição.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.70 | 0.60 - 0.80 |
| **Top K** | 45 | 35 - 55 |
| **Top P** | 0.85 | 0.80 - 0.90 |
| **Min P** | 0.05 | 0.03 - 0.08 |
| **Frequency Penalty** | 0.20 | 0.10 - 0.30 |
| **Presence Penalty** | 0.30 | 0.20 - 0.40 |
| **Repeat Penalty** | 1.05 | 1.02 - 1.08 |
| *A dinâmica: Queremos vocabulário rico, mas sem alucinações que quebrem a anatomia do prompt. As penalidades de presença garantem que a IA adicione novos elementos (iluminação, estilo, ambiente) em vez de repetir exaustivamente a mesma tag principal.* |  |  |

### 19. Descrição Técnica de Objetos, Imagens e Lore Físico

*Foco: Explicar "o que é e como funciona" com literalidade absoluta e clareza anatômica. Ideal para descrever o funcionamento interno de algo, a lógica de um cenário ou as características físicas detalhadas de um objeto/personagem, sem floreios poéticos.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.30 | 0.20 - 0.40 |
| **Top K** | 25 | 15 - 35 |
| **Top P** | 0.60 | 0.50 - 0.70 |
| **Min P** | 0.10 | 0.08 - 0.15 |
| **Frequency Penalty** | 0.05 | 0.00 - 0.10 |
| **Presence Penalty** | 0.10 | 0.00 - 0.15 |
| **Repeat Penalty** | 1.02 | 1.00 - 1.04 |
| *A dinâmica: Temperatura baixa para manter os fatos coerentes e um Min P alto para descartar palavras que causem ambiguidade. O texto deve ser tão claro que não deixe margem para dupla interpretação.* |  |  |

### 20. Expansão de Informação (Elaboração)

*Foco: Pegar um conceito curto ou uma anotação básica e adicionar detalhes relevantes, contexto e exemplos. A IA precisa de criatividade controlada para buscar informações adjacentes, mas não pode desviar do tema central.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.60 | 0.50 - 0.70 |
| **Top K** | 40 | 30 - 50 |
| **Top P** | 0.80 | 0.70 - 0.85 |
| **Min P** | 0.05 | 0.04 - 0.08 |
| **Frequency Penalty** | 0.20 | 0.10 - 0.30 |
| **Presence Penalty** | 0.30 | 0.20 - 0.40 |
| **Repeat Penalty** | 1.05 | 1.02 - 1.08 |
| *A dinâmica: O Presence Penalty é ligeiramente alto para forçar a IA a trazer novos sub-tópicos e expandir o assunto, enquanto a Temperature média garante que essas adições façam sentido lógico com a informação original.* |  |  |

### 21. Desenvolvimento de Conceitos e Estruturação

*Foco: Pegar uma ideia abstrata ou um brainstorming e transformá-lo em algo estruturado (como dividir uma ideia de lore em capítulos organizados ou criar a lógica passo a passo de um sistema).*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.50 | 0.40 - 0.60 |
| **Top K** | 35 | 25 - 45 |
| **Top P** | 0.75 | 0.65 - 0.80 |
| **Min P** | 0.08 | 0.05 - 0.10 |
| **Frequency Penalty** | 0.10 | 0.05 - 0.15 |
| **Presence Penalty** | 0.20 | 0.10 - 0.30 |
| **Repeat Penalty** | 1.02 | 1.00 - 1.05 |
| *A dinâmica: É mais restrito que a Expansão. Aqui queremos que a IA organize e aprofunde o que já existe, criando conexões claras e literais entre os pontos, usando listas ou categorias precisas.* |  |  |

### 22. Alteração e Reescrita (Paráfrase e Mudança de Tom)

*Foco: Mudar completamente as palavras ou o tom de um texto (por exemplo, de informal para acadêmico), mas preservando 100% do significado original e dos fatos.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.35 | 0.25 - 0.45 |
| **Top K** | 30 | 20 - 40 |
| **Top P** | 0.65 | 0.55 - 0.75 |
| **Min P** | 0.05 | 0.03 - 0.08 |
| **Frequency Penalty** | 0.40 | 0.30 - 0.60 |
| **Presence Penalty** | 0.10 | 0.00 - 0.20 |
| **Repeat Penalty** | 1.08 | 1.05 - 1.15 |
| *A dinâmica: Esta é a grande sacada técnica: usamos uma Temperature baixa (para não inventar fatos novos) combinada com um Frequency Penalty alto. Isso obriga a IA a encontrar sinônimos e estruturas de frases diferentes, já que ela é severamente penalizada se usar as mesmas palavras do texto original.* |  |  |

### 23. Fusão e Síntese de Múltiplas Fontes

*Foco: Pegar dois ou mais textos diferentes (ou anotações soltas) e combiná-los em um único documento coerente, eliminando redundâncias e conectando as ideias.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.25 | 0.15 - 0.35 |
| **Top K** | 25 | 15 - 30 |
| **Top P** | 0.55 | 0.45 - 0.65 |
| **Min P** | 0.10 | 0.08 - 0.15 |
| **Frequency Penalty** | 0.15 | 0.10 - 0.25 |
| **Presence Penalty** | 0.10 | 0.00 - 0.15 |
| **Repeat Penalty** | 1.02 | 1.00 - 1.05 |
| *A dinâmica: Um perfil bem analítico. A IA precisa apenas ser uma "cola" entre as informações. O Min P alto garante que as transições entre um texto e outro usem palavras muito seguras e lógicas.* |  |  |

### 24. Filtragem, Limpeza e Padronização de Dados

*Foco: Remover "sujeira" de um texto. Por exemplo, extrair apenas os nomes e datas de um e-mail longo, ou padronizar uma lista bagunçada para um formato consistente.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.10 | 0.00 - 0.20 |
| **Top K** | 15 | 5 - 20 |
| **Top P** | 0.20 | 0.10 - 0.30 |
| **Min P** | 0.05 | 0.02 - 0.10 |
| **Frequency Penalty** | 0.00 | 0.00 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 |
| *A dinâmica: Quase tão estrito quanto a extração de código e JSON. As penalidades precisam ser zero para garantir que a IA possa formatar os dados de forma idêntica (como usar os mesmos marcadores ou títulos) sem ser punida por repetição.* |  |  |

### 25. Análise Crítica e Identificação de Inconsistências

*Foco: Pedir para a IA agir como advogada do diabo ou revisora técnica, procurando falhas de lógica, contradições ou informações incompletas dentro de um texto fornecido.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.40 | 0.30 - 0.50 |
| **Top K** | 30 | 20 - 40 |
| **Top P** | 0.70 | 0.60 - 0.80 |
| **Min P** | 0.08 | 0.05 - 0.12 |
| **Frequency Penalty** | 0.15 | 0.10 - 0.25 |
| **Presence Penalty** | 0.20 | 0.15 - 0.30 |
| **Repeat Penalty** | 1.02 | 1.00 - 1.05 |
| *A dinâmica: É um perfil de leitura profunda. A IA precisa de presença suficiente para "olhar ao redor" do texto e levantar questionamentos (Presence Penalty), mas com uma temperatura controlada para que a crítica seja baseada em lógica e não em opiniões aleatórias.* |  |  |
