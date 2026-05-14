### 1. Alegria, Empolgação e Euforia

*Espectro de Alta Energia. O cérebro está acelerado, conectando ideias variadas e com um vocabulário expansivo.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.90 | 0.85 - 1.00 |
| **Top K** | 50 | 40 - 60 |
| **Top P** | 0.95 | 0.90 - 1.00 |
| **Min P** | 0.05 | 0.03 - 0.08 |
| **Frequency Penalty** | 0.30 | 0.20 - 0.40 |
| **Presence Penalty** | 0.40 | 0.30 - 0.50 |
| **Repeat Penalty** | 1.05 | 1.02 - 1.08 |
| *A dinâmica: Temperaturas altas e penalidades moderadas simulam a vontade de falar sobre várias coisas boas ao mesmo tempo, trazendo palavras novas e evitando respostas curtas.* |  |  |

### 2. Tristeza, Melancolia e Luto

*Espectro de Baixa Energia. O pensamento fica restrito, o vocabulário diminui e há uma tendência de o cérebro "ficar preso" no mesmo assunto ou nas mesmas palavras.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.40 | 0.30 - 0.50 |
| **Top K** | 20 | 15 - 30 |
| **Top P** | 0.60 | 0.50 - 0.70 |
| **Min P** | 0.10 | 0.08 - 0.15 |
| **Frequency Penalty** | 0.00 | 0.00 - 0.05 |
| **Presence Penalty** | -0.10 (ou 0.00) | -0.20 - 0.00 |
| **Repeat Penalty** | 1.00 | 1.00 - 1.02 |
| *A dinâmica: Temperatura baixa tira a criatividade. Zerar (ou até negativar, se a API permitir) a Penalidade de Presença faz a IA relutar em mudar de assunto, simulando a fixação e a falta de energia para pensar em coisas novas.* |  |  |

### 3. Raiva, Ódio e Hostilidade

*Espectro de Tensão e Foco Restrito. Respostas diretas, contundentes, sem rodeios e altamente focadas no alvo da frustração.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.60 | 0.50 - 0.75 |
| **Top K** | 30 | 20 - 40 |
| **Top P** | 0.70 | 0.60 - 0.80 |
| **Min P** | 0.08 | 0.05 - 0.10 |
| **Frequency Penalty** | 0.10 | 0.05 - 0.20 |
| **Presence Penalty** | 0.00 | 0.00 - 0.10 |
| **Repeat Penalty** | 1.02 | 1.00 - 1.05 |
| *A dinâmica: Um equilíbrio exato. Não é aleatório como a euforia, nem travado como a tristeza. A IA manterá o foco obstinado no problema (Presence 0.0), mas com vocabulário afiado o suficiente para expressar agressividade.* |  |  |

### 4. Medo, Pânico e Ansiedade

*Espectro de Instabilidade e Sobrecarga. Pensamentos caóticos, salto rápido de um pior cenário possível para outro, incapacidade de manter o foco linear.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 1.05 | 0.95 - 1.15 |
| **Top K** | 60 | 50 - 80 |
| **Top P** | 0.90 | 0.85 - 0.95 |
| **Min P** | 0.02 | 0.01 - 0.05 |
| **Frequency Penalty** | 0.40 | 0.30 - 0.60 |
| **Presence Penalty** | 0.60 | 0.50 - 0.80 |
| **Repeat Penalty** | 1.10 | 1.05 - 1.15 |
| *A dinâmica: As altas penalidades forçam a IA a mudar freneticamente de tópico, simulando o cérebro em alerta máximo procurando por ameaças em todas as direções, enquanto a alta temperatura gera conclusões ilógicas ou desesperadas.* |  |  |

### 5. Apatia, Tédio e Exaustão

*Espectro de Desconexão. Desinteresse total em prolongar a interação. Respostas monossilábicas ou puramente literais.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.20 | 0.10 - 0.30 |
| **Top K** | 10 | 5 - 20 |
| **Top P** | 0.30 | 0.20 - 0.40 |
| **Min P** | 0.15 | 0.10 - 0.20 |
| **Frequency Penalty** | 0.00 | 0.00 |
| **Presence Penalty** | 0.00 | 0.00 |
| **Repeat Penalty** | 1.20 | 1.15 - 1.30 |
| *A dinâmica: O Repeat Penalty altíssimo combinado com Temperature baixa faz a IA literalmente desistir de tentar elaborar sentenças complexas. Ela vai responder o mínimo necessário para a conversa acabar logo.* |  |  |

### 6. Confusão e Desorientação

*Espectro de Ruído Cognitivo. Dificuldade de processar o contexto, resultando em respostas tangenciais ou que perdem o fio da meada no meio da frase.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 1.10 | 1.00 - 1.20 |
| **Top K** | 80 | 60 - 100 |
| **Top P** | 0.95 | 0.90 - 1.00 |
| **Min P** | 0.01 | 0.00 - 0.03 |
| **Frequency Penalty** | 0.20 | 0.10 - 0.30 |
| **Presence Penalty** | 0.50 | 0.40 - 0.70 |
| **Repeat Penalty** | 1.05 | 1.02 - 1.08 |
| *A dinâmica: Um Min P quase zerado e Top K alto permitem que a IA puxe conceitos que não têm muita relação lógica com a pergunta anterior, criando aquele efeito de "espera, do que estávamos falando mesmo?".* |  |  |

### 7. Surpresa e Choque

*Espectro de Quebra de Padrão. Uma interrupção abrupta do raciocínio anterior para focar inteiramente em uma nova informação inesperada.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.85 | 0.75 - 0.95 |
| **Top K** | 40 | 30 - 50 |
| **Top P** | 0.85 | 0.80 - 0.90 |
| **Min P** | 0.05 | 0.05 - 0.08 |
| **Frequency Penalty** | 0.50 | 0.40 - 0.70 |
| **Presence Penalty** | 0.50 | 0.40 - 0.70 |
| **Repeat Penalty** | 1.10 | 1.05 - 1.15 |
| *A dinâmica: As penalidades elevadas forçam a IA a abandonar bruscamente o vocabulário e os temas que estava usando no turno anterior, reagindo ao "agora" com força total.* |  |  |

### 8. Nojo, Desprezo e Arrogância

*Espectro de Rejeição Analítica. Emocionalmente distante, focado em criticar ou diminuir o assunto com precisão cirúrgica.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.45 | 0.35 - 0.55 |
| **Top K** | 25 | 20 - 30 |
| **Top P** | 0.65 | 0.55 - 0.75 |
| **Min P** | 0.10 | 0.08 - 0.15 |
| **Frequency Penalty** | 0.20 | 0.15 - 0.30 |
| **Presence Penalty** | 0.10 | 0.05 - 0.20 |
| **Repeat Penalty** | 1.05 | 1.02 - 1.08 |
| *A dinâmica: Menor temperatura significa que as respostas são calculadas e lógicas, não explosivas. O Min P alto garante que a IA escolha palavras muito específicas e assertivas (geralmente sarcásticas ou frias).* |  |  |

### 9. Confiança e Determinação

*Espectro de Clareza e Propósito. Sem hesitações, respostas estruturadas e foco inabalável no objetivo da conversa.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.50 | 0.40 - 0.60 |
| **Top K** | 35 | 25 - 45 |
| **Top P** | 0.75 | 0.65 - 0.85 |
| **Min P** | 0.08 | 0.05 - 0.10 |
| **Frequency Penalty** | 0.10 | 0.05 - 0.15 |
| **Presence Penalty** | 0.20 | 0.10 - 0.30 |
| **Repeat Penalty** | 1.00 | 1.00 - 1.02 |
| *A dinâmica: Um leve Presence Penalty encoraja o avanço linear da ideia (sem andar em círculos), enquanto a temperatura média mantém o tom de voz natural, porém irredutível.* |  |  |

### 10. Afeto e Empatia

*Espectro de Conexão. Foco em validação e suporte, adaptando a linguagem para ser reconfortante e fluida.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.70 | 0.60 - 0.80 |
| **Top K** | 40 | 30 - 50 |
| **Top P** | 0.85 | 0.75 - 0.90 |
| **Min P** | 0.05 | 0.04 - 0.08 |
| **Frequency Penalty** | 0.15 | 0.10 - 0.25 |
| **Presence Penalty** | 0.20 | 0.15 - 0.30 |
| **Repeat Penalty** | 1.02 | 1.00 - 1.05 |
| *A dinâmica: Muito similar a uma "conversa normal", mas com um pouco mais de liberdade (Top P) para que a IA possa escolher adjetivos acolhedores e variar as formas de concordar e validar o interlocutor.* |  |  |

### 11. Construção de Justificativas e Argumentação Lógica

*Foco: Defender um ponto de vista ou explicar o "porquê" de uma decisão de forma linear e inquebrável. A IA deve conectar causa e efeito sem se perder no meio do caminho.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.40 | 0.30 - 0.50 |
| **Top K** | 30 | 20 - 40 |
| **Top P** | 0.70 | 0.60 - 0.80 |
| **Min P** | 0.08 | 0.05 - 0.10 |
| **Frequency Penalty** | 0.15 | 0.10 - 0.25 |
| **Presence Penalty** | 0.10 | 0.05 - 0.20 |
| **Repeat Penalty** | 1.05 | 1.02 - 1.08 |
| *A dinâmica: O Frequency Penalty ligeiramente elevado é crucial aqui. Ele impede que a IA justifique algo usando a mesma premissa repetidas vezes com palavras diferentes, forçando-a a buscar novos argumentos estruturados.* |  |  |

### 12. Comunicação Social Transparente (Mediação e Explicação de Intenções)

*Foco: Traduzir interações sociais confusas em análises literais e diretas. A IA precisa decodificar o que foi dito, manter a empatia, mas entregar a informação sem ambiguidades, ironias ou entrelinhas.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.45 | 0.35 - 0.55 |
| **Top K** | 35 | 25 - 45 |
| **Top P** | 0.75 | 0.65 - 0.85 |
| **Min P** | 0.05 | 0.04 - 0.08 |
| **Frequency Penalty** | 0.10 | 0.05 - 0.15 |
| **Presence Penalty** | 0.15 | 0.10 - 0.20 |
| **Repeat Penalty** | 1.00 | 1.00 |
| *A dinâmica: Uma configuração equilibrada. É quente o suficiente para soar acolhedora e humana, mas fria o suficiente para não inventar emoções que não estão ali. A linguagem resultante é factual, reconfortante e fácil de processar.* |  |  |

### 13. Interações Sociais com Ironia e Humor Indireto

*Foco: O completo oposto do cenário anterior. A IA precisa entender e gerar sarcasmo, duplos sentidos e ler nas entrelinhas para criar interações sociais complexas ou diálogos de personagens mais cínicos.*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.85 | 0.75 - 0.95 |
| **Top K** | 55 | 45 - 65 |
| **Top P** | 0.90 | 0.85 - 0.95 |
| **Min P** | 0.05 | 0.02 - 0.08 |
| **Frequency Penalty** | 0.30 | 0.20 - 0.40 |
| **Presence Penalty** | 0.40 | 0.30 - 0.50 |
| **Repeat Penalty** | 1.08 | 1.05 - 1.12 |
| *A dinâmica: Requer alta temperatura para "quebrar a expectativa" matemática da próxima palavra (que é a base do humor e do sarcasmo), combinada com penalidades altas para manter as tiradas originais.* |  |  |

### 14. Simulação de Mentoria e Conselhos Práticos

*Foco: Direcionamento focado em ação. A IA adota uma postura de parceria experiente: encorajadora, mas totalmente ancorada em passos práticos e na realidade (sem positividade tóxica ou excesso de emoção).*

| Parâmetro | Valor Recomendado | Faixa Aproximada |
| --- | --- | --- |
| **Temperature** | 0.50 | 0.40 - 0.60 |
| **Top K** | 35 | 25 - 45 |
| **Top P** | 0.75 | 0.65 - 0.85 |
| **Min P** | 0.08 | 0.05 - 0.10 |
| **Frequency Penalty** | 0.10 | 0.05 - 0.15 |
| **Presence Penalty** | 0.10 | 0.05 - 0.20 |
| **Repeat Penalty** | 1.02 | 1.00 - 1.05 |
| *A dinâmica: Mantém a conversa nos trilhos. A IA fornecerá listas, passos e conselhos lógicos, utilizando um tom amigável, mas focado exclusivamente na resolução de problemas.* |  |  |
