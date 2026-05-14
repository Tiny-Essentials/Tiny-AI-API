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

---------------------------------------------------

### 1. O que são e como usar os parâmetros

A IA gera textos prevendo a próxima palavra (ou "token") com base em uma lista de probabilidades. Os parâmetros abaixo são filtros que você aplica nessa lista *antes* de a IA escolher a palavra final.

* **Temperature (Temperatura):** É o controle principal de aleatoriedade.
* **Como funciona:** Valores próximos a `0.0` forçam a IA a escolher sempre a palavra mais óbvia e segura (ação determinística). Valores altos (acima de `0.8`) "achatam" as probabilidades, dando chance para palavras menos óbvias serem escolhidas.
* **Como usar:** Use valores baixos para lógica e matemática, e valores altos para poesia e criatividade.


* **Top K:** É um filtro de quantidade absoluta.
* **Como funciona:** Se você define Top K como `40`, a IA vai olhar para todas as milhares de palavras possíveis e jogar fora todas, *exceto* as 40 com maior chance de estarem certas.
* **Como usar:** Serve para cortar "alucinações graves". Mesmo com a Temperatura alta, um Top K razoável impede que a IA escolha uma palavra que não faz o menor sentido gramatical.


* **Top P (Nucleus Sampling):** É um filtro de probabilidade acumulada.
* **Como funciona:** Se definido como `0.90`, a IA pega as palavras mais prováveis e vai somando suas porcentagens até dar 90%. Tudo que ficar fora desses 90% é descartado.
* **Como usar:** É mais dinâmico que o Top K. Se a próxima palavra for muito óbvia, o Top P restringe as opções a 2 ou 3 palavras. Se a frase for muito aberta, ele permite dezenas de opções. Geralmente, ajusta-se a Temperatura ou o Top P, deixando o outro em um valor mais neutro.


* **Min P:** É um filtro de qualidade relativa (um parâmetro mais recente e excelente).
* **Como funciona:** Ele avalia as opções com base na palavra *mais* provável. Se a palavra mais provável tem 50% de chance de ser escolhida e o Min P é `0.10` (10%), a IA descarta qualquer palavra que tenha menos de 5% de chance (10% de 50%).
* **Como usar:** É perfeito para manter a coerência em textos muito criativos. Ele garante que, por mais maluca que a IA tente ser, ela nunca escolha uma palavra que seja absurdamente inferior à melhor opção disponível.


* **Frequency Penalty (Penalidade de Frequência):**
* **Como funciona:** Penaliza uma palavra com base em *quantas vezes* ela já apareceu no texto. Quanto mais a palavra é usada, mais a IA evita usá-la novamente.
* **Como usar:** Excelente para evitar que a IA fique repetindo os mesmos adjetivos ou vícios de linguagem em textos longos.


* **Presence Penalty (Penalidade de Presença):**
* **Como funciona:** Penaliza uma palavra simplesmente se ela já apareceu no texto, não importa se foi uma ou dez vezes.
* **Como usar:** Força a IA a mudar de assunto e trazer novos conceitos ou vocabulário para a conversa, em vez de ficar girando em torno do mesmo tópico.


* **Repeat Penalty (Penalidade de Repetição):**
* **Como funciona:** É um multiplicador matemático aplicado diretamente nos tokens já gerados. O valor neutro é `1.0`. Valores maiores que 1 diminuem a chance do token ser selecionado novamente.
* **Como usar:** Atua de forma semelhante ao Frequency Penalty, mas em um nível estrutural mais baixo na API. Muito usado para evitar que a IA entre em "loops" de repetição infinitos.



---

### 2. A lógica dos parâmetros em cada cenário

Agora que entendemos as ferramentas, veja por que aquelas configurações específicas fazem o que fazem:

#### Cenários de Alta Criatividade e Expansão

**(Roleplay, Geração de Lore / Brainstorming)**

* **A Dinâmica:** Aqui, nós "abrimos a torneira". A **Temperature**, **Top P** e **Top K** estão altos para permitir que a IA busque palavras inusitadas, gerando reviravoltas na história e ideias originais. Para evitar que a IA fique repetindo a mesma ação no Roleplay (ex: sorrir, suspirar), nós elevamos bastante o **Frequency** e **Presence Penalty**. Isso obriga a IA a avançar a narrativa e usar verbos novos.

#### Cenários de Diálogo Natural

**(Conversas Normais, Conversas sobre um Assunto Específico)**

* **A Dinâmica:** O objetivo aqui é emular um cérebro humano focado. A **Temperature** fica na média (0.40 a 0.70) para que as respostas não sejam robóticas, mas também não sejam caóticas. As penalidades (Frequency/Presence) ficam bem baixinhas, apenas o suficiente para a IA não parecer um disco arranhado, mas permitindo que ela use palavras comuns (como pronomes e conjunções) naturalmente.

#### Cenários Analíticos e de Informação

**(Responder Perguntas, RAG/Livros, Resumo de Textos, Tradução, Correção)**

* **A Dinâmica:** Aqui a IA precisa ser um acadêmico engravatado. A **Temperature** cai drasticamente. O **Top K** e **Top P** são apertados. Nós estamos dizendo para a IA: "Só escolha as palavras que você tem certeza absoluta de que estão certas". Para o *Resumo*, especificamente, usamos um pouquinho mais de **Presence Penalty** para forçar a IA a ler o texto todo e pegar todos os pontos, em vez de focar apenas no primeiro parágrafo. Para *Tradução* e *Correção*, as penalidades são quase zero para não impedir a IA de usar a palavra gramaticalmente correta só porque ela já apareceu antes.

#### Cenários de Determinismo Absoluto

**(Programação, Extração JSON)**

* **A Dinâmica:** O caos precisa ser zero. Uma vírgula ou um parêntese no lugar errado quebra tudo. **Temperature** vai para 0.0, **Top K** vai para 1. Isso transforma a IA numa máquina determinística: para a mesma entrada, sempre a mesmíssima saída. As penalidades (*Frequency, Presence e Repeat*) **precisam obrigatoriamente ser zero ou neutras**. Se você penalizar repetição em código, a IA vai se recusar a fechar chaves `}` ou a usar a variável `let index` mais de uma vez, destruindo completamente a sintaxe.
