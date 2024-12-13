O projeto Checkpoint é um aplicativo em React-Typescript que visa facilitar o gerenciamento de estagiários, por meio de um sistema de cadastro de tarefas que podem ser concluídas e registro de presença automatizado que podem ser facilmente acessados e lidos por meio de dashboards e relatórios automaticamente criados.

O processo de gestão de estagiários requer um investimento considerável de tempo, que em muitos casos é detrimental a produtividade e seus gestores, o Checkpoint visa reduzir o tempo gasto neste processo por meio de um aplicativo intuitivo e de fácil uso, acesso aos dados relevantes em multiplas formas visualização, para o uso mais fácil, eficiente e rápido.

Documentação
https://docs.google.com/document/d/1pGp7fBkgc4rtjkurOUZEJAsxfCGPo3NcEaC-q_ZKlwY/edit?usp=sharing

```mermaid

---
config:
  layout: fixed
title: Diagrama de Casos de Uso
---
flowchart LR
 subgraph Sistema["Sistema"]
        uc01(["Recuperar senha"])
        uc02(["Autenticar-se no sistema"])
        uc03(["Visualizar o seu ranking"])
        uc04(["Visualizar suas tarefas"])
        uc05(["Concluir uma tarefa"])
        uc06(["Visualizar suas presenças"])
        uc07(["Enviar justificativa de falta"])
        uc08(["Visualizar próprio dashboard"])
        uc09(["Registrar presença"])
        uc010(["Fazer logout"])
        uc011(["Criar tarefa"])
        uc012(["Cancelar tarefa"])
        uc013(["Editar e arquivar tarefa"])
        uc014(["Avaliar conclusão de tarefa"])
        uc015(["Visualizar métricas do estagiário"])
        uc016(["Visualizar métricas comparativas"])
        uc017(["Cadastrar conta no sistema"])
  end
    es["Estagiário"] --> uc01 & uc02 & uc03 & uc04 & uc05 & uc06 & uc07 & uc08 & uc09
    me["Mentor"] --> uc02 & uc011 & uc012 & uc013 & uc014 & uc04 & uc015
    ad["Administrador"] --> uc017 & uc02 & uc016
    uc09 -- ". include ." --> uc02
    uc03 -- ". include ." --> uc02
    uc04 -- ". include ." --> uc02
    uc06 -- ". include ." --> uc02
    uc08 -- ". include ." --> uc02
    uc05 -- ". extend ." --> uc04
    uc07 -- ". extend ." --> uc06
    uc010 -- ". extend ." --> uc02
    uc011 -- ". include ." --> uc02
    uc012 -- ". extend ." --> uc011
    uc013 -- ". extend ." --> uc04
    uc014 -- ". extend ." --> uc05
    uc015 -- ". include ." --> uc02
    uc016 -- ". include ." --> uc02
    uc017 -- ". include ." --> uc02
```
```mermaid

---
config:
  layout: fixed
title: Diagrama de Classe
---

classDiagram
  class Usuario {
    +UUID idUsuario
    +String nome
    +String sobrenome
    +String email
    +String senha
    +String codigoRecuperacao
    +int role
    +Squad squad
    +autenticar(): void
    +recuperarSenha(): void
    +visualizarDashboard(): void
}

class Squad {
    +UUID idSquad
    +String nome
    +boolean ativa
    +visualizarMembros(): void
}

class SquadMentor {
    +UUID idSquadMentor
    +UUID idSquad
    +UUID idMentor
}

class JustificativaFalta {
    +UUID idJustificativa
    +UUID idPresenca
    +String anexo
    +String motivo
    +Time horarioValidacao
    +boolean validada
    +enviar(): void
}

class Presenca {
    +UUID idPresenca
    +UUID idUsuario
    +UUID idCalendarioAtivo
    +Time horarioEntrada
    +Time horarioSaida
    +Date data
    +registrar(): void
    +visualizar(): void
}

class CalendarioAtivo {
    +UUID idCalendarioAtivo
    +Date data
    +boolean ativoSemestre
}

class Midia {
    +UUID idMidia
    +String descricao
}

class Tarefa {
    +UUID idTarefa
    +UUID idMidia
    +UUID idUsuario
    +String titulo
    +int dificuldade
    +String descricao
    +String comentariosMentor
    +Date data
    +criar(): void
    +concluir(): void
    +visualizar(): void
}

class TarefaUsuarioMidia {
    +UUID idTarefaUsuarioMidia
    +UUID idUsuario
    +UUID idMidia
    +UUID idTarefa
}

class Estagiario {
    +UUID idEstagiario
    +UUID idUsuario
    +UUID idSquad
    +String matricula
    +boolean ativa
    +visualizarMetricas(): void
}

class Expediente {
    +UUID idExpediente
    +Time horario
    +Date data
    +String descricao
}

class Notificacao {
    +UUID idNotificacao
    +UUID idUsuario
    +Time horario
    +Date data
    +String mensagem
    +enviar(): void
}

Usuario --> Presenca : "registra"
Usuario --> Tarefa : "realiza"
Usuario --> Squad : "pertence"
Usuario --> Notificacao : "recebe"

Presenca --> CalendarioAtivo : "referencia"
Presenca --> JustificativaFalta : "pode ter"

Tarefa --> Midia : "alinhada"
Tarefa --> TarefaUsuarioMidia : "relacionada"

Squad --> SquadMentor : "mentoria"

Estagiario --> Squad : "monitoramento"
```