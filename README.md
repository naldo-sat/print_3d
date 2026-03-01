# 🖨️ Conecta Print - Calculadora de Impressão 3D

## 📋 Sobre o Projeto

**Conecta Print** é uma aplicação web profissional e completa para cálculo de custos de impressão 3D, desenvolvida para substituir planilhas Excel por uma interface intuitiva, moderna e personalizável. O sistema permite configuração detalhada de custos, gerenciamento de múltiplas impressoras, controle de estoque de filamentos, personalização visual completa e manutenção de histórico com filtros avançados.

## ✨ Funcionalidades Implementadas

### 🧮 Calculadora de Impressão
- **Cálculo rápido e preciso** de custos de impressão
- **Seleção de impressora** - escolha entre múltiplas impressoras cadastradas
- **Seleção de filamento** - com exibição de preço por grama e cor cadastrada
- Entrada de dados manual:
  - Nome do modelo
  - Peso em gramas
  - **Tempo de impressão flexível**: campos numéricos para horas (0-99h) e minutos (0-59min)
  - Taxa de falha (%)
  - Margem de lucro (%)
- **Percentual de falhas**: contabiliza material desperdiçado no cálculo
- **Cálculo linear**: taxa de falha + margem de lucro aplicados de forma aditiva
- Cálculo automático de:
  - Custo do material (baseado no peso, taxa de falha e preço do filamento)
  - Custo de energia (baseado no consumo específico de cada impressora e tempo)
  - Margem de lucro configurável
  - Preço final sugerido
- Exibição detalhada do resultado com breakdown de custos
- Opção de salvar cálculo no histórico
- **Funcionalidade de impressão otimizada**: layout limpo e profissional com valor final em destaque

### 📊 Dashboard & Histórico Unificado
- **Dashboard com estatísticas consolidadas**:
  - Total de orçamentos realizados
  - Valor total de todos os orçamentos
  - Lucro total acumulado
  - Peso total do material utilizado (gramas)
- **Gráficos interativos**:
  - Gráfico de pizza: Filamentos mais utilizados **com cores reais dos filamentos**
  - Gráfico de barras: Evolução de custos e preços finais
  - Gráficos responsivos e otimizados (altura fixa de 280px)
- **Histórico completo integrado**:
  - Exibição de todos os cálculos com impressora utilizada
  - **Filtros de período avançados**:
    - Todos os períodos
    - Hoje
    - Esta semana
    - Este mês
    - Este ano
    - Período personalizado (seleção de data inicial e final)
  - Busca por nome do modelo
  - Visualização detalhada de cálculos anteriores
  - Opção de recarregar cálculo para edição
  - Exclusão individual ou limpeza total do histórico

### ⚙️ Configurações (Sistema de Abas)

#### 📦 Aba: Filamentos
- Cadastro completo de filamentos com:
  - Nome personalizado
  - Tipo (PLA, ABS, PETG, TPU, Nylon, Outro)
  - **Cor (seletor visual de cores)** - usado nos gráficos do Dashboard
  - Quantidade em gramas
  - Preço total do rolo
  - Cálculo automático do preço por grama
- Visualização em cards com **cor visual do filamento**
- Edição e exclusão de filamentos
- Interface visual intuitiva com indicadores de contraste

#### 🖨️ Aba: Impressoras (NOVO)
- **Sistema de múltiplas impressoras**
- Cadastro completo com:
  - Nome da impressora
  - Modelo
  - Consumo de energia (Watts)
  - Custo por kWh específico
- Visualização em cards organizados
- Edição e exclusão de impressoras
- Seleção automática na calculadora
- **Removido**: Campo "Custo por Hora de Impressão" (cálculo simplificado)

#### 🎨 Aba: Personalização (NOVO)
- **Nome da aplicação personalizável**
  - Altere o nome exibido no menu
  - Atualiza também o título da página
- **Paleta de cores customizável**:
  - Cor primária (código hexadecimal)
  - Cor secundária (código hexadecimal)
  - Seletores de cor visuais
  - Prévia do gradiente em tempo real
  - Aplicação imediata em toda a interface
- **Upload de logotipo**:
  - Substitui o ícone padrão por logo personalizado
  - Formatos aceitos: JPG, PNG, SVG
  - Tamanho máximo: 2MB
  - Prévia antes de salvar
  - Opção de remover logo
- **Restaurar padrões**: Voltar às configurações originais

### 🎯 Interface e Experiência Aprimorada

#### Menu Lateral Recolhível
- **Botão de recolher menu** - economize espaço na tela
- Menu compacto mantém ícones visíveis
- Estado salvo localmente (permanece após recarregar)
- Transições suaves
- Menu responsivo em mobile

#### Navegação Otimizada
- **Ordem reorganizada**:
  1. 🧮 Calculadora
  2. 📊 Dashboard (integrado com Histórico)
  3. ⚙️ Configurações (com 3 abas)
- Navegação intuitiva e lógica
- Feedback visual para página ativa

#### Design Profissional
- **Design moderno e responsivo**
  - Funciona perfeitamente em desktop, tablet e mobile
  - Layout adaptativo com sidebar retrátil
- **Modo escuro/claro**
  - Alternância com um clique
  - Preferência salva localmente
  - Transições suaves entre temas
  - Cores personalizadas respeitam o modo escuro
- **Animações e transições**
  - Efeitos suaves de entrada/saída
  - Feedback visual em hover e cliques
  - Experiência fluida e profissional

### 💾 Armazenamento de Dados
- Utiliza **RESTful Table API** para persistência
- Cinco tabelas principais:
  - `printers`: Cadastro de múltiplas impressoras
  - `filaments`: Estoque de filamentos
  - `calculations`: Histórico de cálculos (inclui printer_id e printer_name)
  - `customization`: Personalização da interface
  - ~~`configurations`~~: Removida (substituída por configurações por impressora)
- Dados mantidos entre sessões
- Operações CRUD completas

## 🚀 Como Usar

### 1. Configuração Inicial

**Primeiro acesso - Configure a Personalização** (Opcional):
- Acesse "Configurações" → Aba "Personalização"
- Defina o nome da sua empresa/calculadora
- Escolha as cores da sua marca
- Faça upload do seu logotipo

**Cadastre suas Impressoras**:
- Acesse "Configurações" → Aba "Impressoras"
- Clique em "Adicionar Impressora"
- Preencha: nome, modelo, consumo em Watts e custo do kWh
- Salve - você pode cadastrar quantas impressoras precisar

**Cadastre seus Filamentos**:
- Acesse "Configurações" → Aba "Filamentos"
- Clique em "Adicionar Filamento"
- Preencha: nome, tipo, **cor (seletor visual)**, quantidade e preço do rolo
- O preço por grama é calculado automaticamente
- A cor escolhida será exibida nos cards e nos gráficos do Dashboard
- Salve

### 2. Calcular Custo de Impressão

**Entrada Manual**
1. Informe o nome do modelo
2. **Selecione a impressora** que será usada
3. Selecione o filamento a ser usado (exibe a cor cadastrada)
4. Digite o peso em gramas
5. **Informe o tempo de impressão**: campos numéricos para horas (0-99) e minutos (0-59)
6. Defina a **taxa de falha** (% de material desperdiçado) - padrão 5%
7. Defina a margem de lucro desejada (%) - padrão 30%
8. Clique em "Calcular"

**Resultado:**
- Veja o resultado detalhado incluindo o material com desperdício
- O cálculo usa método linear: falha + margem = acréscimo total
- Opcionalmente, salve no histórico ou imprima o orçamento
- Orçamento impresso em formato profissional com valor final destacado

### 3. Acompanhar Dashboard e Histórico

**Na aba "Dashboard"**:
- Visualize as 4 estatísticas principais:
  - **Total de Orçamentos**
  - **Valor Total** acumulado
  - **Lucro Total** acumulado
  - **Peso do Material** utilizado
- Analise gráficos interativos:
  - **Filamentos Mais Utilizados** (com as cores reais dos filamentos)
  - **Evolução de Custos e Preços**
- Role para baixo para ver o **Histórico completo**
- Use os filtros de período:
  - "Todos os períodos" - exibe tudo
  - "Hoje" - cálculos de hoje
  - "Esta semana" - últimos 7 dias
  - "Este mês" - mês corrente
  - "Este ano" - ano corrente
  - "Personalizado" - escolha data inicial e final
- Use a busca para filtrar por nome
- Clique em "Ver detalhes" para carregar um cálculo na calculadora
- Exclua cálculos individuais ou limpe todo o histórico

### 4. Gerenciar Configurações

**Na aba "Configurações"**:
- **Aba Filamentos**: Adicione, edite ou remova filamentos
- **Aba Impressoras**: Gerencie múltiplas impressoras
- **Aba Personalização**: Customize a aparência da aplicação

## 🔧 Estrutura Técnica

### Tecnologias Utilizadas
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização avançada com variáveis CSS dinâmicas
- **JavaScript (Vanilla)**: Lógica da aplicação
- **Chart.js**: Gráficos interativos
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia (Inter)

### Arquitetura
```
print-calc/
├── index.html          # Estrutura HTML completa
├── css/
│   └── style.css       # Estilos completos (light/dark mode + personalizáveis)
├── js/
│   └── app.js          # Lógica completa da aplicação
└── README.md           # Documentação
```

### Schemas de Dados

#### Tabela: `printers` (NOVO)
```javascript
{
  id: "text",
  name: "text",                     // Nome da impressora
  model: "text",                    // Modelo
  power_watts: "number",            // Consumo em Watts
  energy_cost_kwh: "number"         // Custo por kWh
}
```

#### Tabela: `filaments`
```javascript
{
  id: "text",
  name: "text",                     // Nome do filamento
  type: "text",                     // PLA, ABS, PETG, etc.
  color: "text",                    // Cor (texto)
  color_hex: "text",                // Cor em formato hex (#RRGGBB) - NOVO
  quantity_grams: "number",         // Quantidade em gramas
  price_total: "number",            // Preço do rolo
  price_per_gram: "number"          // Calculado automaticamente
}
```

#### Tabela: `calculations`
```javascript
{
  id: "text",
  model_name: "text",               // Nome do modelo
  printer_id: "text",               // ID da impressora
  printer_name: "text",             // Nome da impressora
  filament_id: "text",              // ID do filamento
  filament_name: "text",            // Nome do filamento
  weight_grams: "number",           // Peso usado
  weight_with_failure: "number",    // Peso incluindo falhas - NOVO
  failure_rate: "number",           // Taxa de falha (%) - NOVO
  print_time_hours: "number",       // Tempo total em horas
  print_time_formatted: "text",     // Tempo formatado (ex: 2h 30min) - NOVO
  material_cost: "number",          // Custo do material
  energy_cost: "number",            // Custo de energia
  total_cost: "number",             // Custo total
  profit_margin_percent: "number",  // % de lucro
  profit_value: "number",           // Valor do lucro
  final_price: "number",            // Preço final
  calculation_date: "datetime"      // Data do cálculo
}
```

#### Tabela: `customization` (NOVO)
```javascript
{
  id: "text",
  app_name: "text",                 // Nome da aplicação
  primary_color: "text",            // Cor primária (hex)
  secondary_color: "text",          // Cor secundária (hex)
  logo_url: "text"                  // URL ou base64 do logo
}
```

## 🎯 Fórmulas de Cálculo

### Método de Cálculo Linear (v2.2+)

O sistema aplica taxa de falha e margem de lucro de forma **linear e aditiva** sobre o custo base:

```
1. Custo Base do Material = Peso (g) × Preço por Grama
2. Custo Base de Energia = (Potência (W) / 1000) × Tempo (h) × Custo kWh (R$)
3. Custo Base Total = Material + Energia

4. Custo da Falha = Custo Base × (Taxa de Falha % / 100)
5. Valor do Lucro = Custo Base × (Margem % / 100)

6. Custo Total = Custo Base + Custo da Falha
7. Preço Final = Custo Base + Custo da Falha + Valor do Lucro
```

### Por que Linear?
Se você tem **15% de falha** e **35% de margem**, o total é exatamente **50%** sobre o custo base.
Isso torna o cálculo intuitivo: `15% + 35% = 50%`

### Exemplo Prático
```
Dados:
- Peso: 17g
- Taxa de Falha: 15%
- Tempo: 55min (0.9167h)
- Filamento: R$ 0.050/g
- Impressora: 200W, R$ 0.80/kWh
- Margem: 35%

Cálculo:
1. Material Base: 17g × R$ 0.050 = R$ 0.85
2. Energia Base: (200W / 1000) × 0.9167h × R$ 0.80 = R$ 0.15
3. Custo Base: R$ 0.85 + R$ 0.15 = R$ 1.00

4. Custo da Falha: R$ 1.00 × 15% = R$ 0.15
5. Valor do Lucro: R$ 1.00 × 35% = R$ 0.35

6. Custo Total: R$ 1.00 + R$ 0.15 = R$ 1.15
7. Preço Final: R$ 1.00 + R$ 0.15 + R$ 0.35 = R$ 1.50

Total de Acréscimo: 50% (15% + 35%) ✓
```

## 📱 Compatibilidade

- ✅ Chrome/Edge (Chromium) - Recomendado
- ✅ Firefox
- ✅ Safari
- ✅ Mobile (iOS/Android) - **Interface totalmente otimizada**
- ✅ Tablet

## 🎨 Recursos Visuais

- **Gradientes personalizáveis**: Interface com suas cores
- **Logo personalizado**: Adicione a identidade da sua marca
- **Modo escuro**: Suave para os olhos, respeita personalização
- **Animações**: Transições fluidas
- **Icons**: Font Awesome para clareza visual
- **Responsividade completa**: Layout adaptado para mobile, tablet e desktop
- **Menu recolhível**: Maximize o espaço de trabalho

## 🔐 Privacidade

- Todos os dados são armazenados no servidor do projeto
- Logos são armazenados em base64 no banco de dados
- Nenhuma informação é compartilhada com terceiros
- Preferências (tema, menu colapsado) armazenadas localmente no navegador

## 📈 Próximos Passos Sugeridos

### Funcionalidades Futuras
1. **Exportação de relatórios PDF** - Gerar orçamentos profissionais em PDF
2. **Backup/Restore** - Exportar e importar dados completos (JSON)
3. **Taxa de falha** - Considerar % de desperdício nos cálculos
4. **Notificações de estoque baixo** - Alertas quando filamento está acabando
5. **Categorias de projetos** - Organizar cálculos por cliente/projeto
6. **Comparação de filamentos** - Comparar custos entre diferentes materiais
7. **Templates de impressão** - Salvar configurações comuns
8. **Multi-idioma** - Suporte para inglês e espanhol
9. **Gráficos adicionais** - Análise de custos por impressora, por período
10. **API de integração** - Conectar com outras ferramentas

### Melhorias Técnicas
- Cache de dados para performance
- PWA (Progressive Web App) para uso offline
- Sincronização em nuvem opcional
- Testes automatizados
- Otimização de imagens de logo

## 🆘 Suporte

Para dúvidas ou sugestões, consulte a documentação ou entre em contato.

## 📝 Changelog

### Versão 2.7 (Atual) - 2026-03-01
- ⚙️ **PERSONALIZAÇÃO REFORMULADA**:
  - Botões de Salvar e Restaurar individuais por card (Nome, Cores, Logo)
  - Simplificação: removida cor secundária e cor de botões (apenas Cor de Tema e Cor de Fundo)
  - Valores padrão atualizados: #002fff (azul) e #c4dae9 (cinza-azulado)
  - Cor de fundo agora altera apenas o body, não os inputs/cards
  - Valor Total usa a cor primária do tema (em vez de verde fixo)
- 🐛 **CORREÇÕES**:
  - Nome do app agora salva corretamente
  - Botão Restaurar Padrão funciona para cada seção
  - Peso no PDF corrigido (17g em vez de 17.00gg)
- 🎨 **UNIFICAÇÃO DE CORES**:
  - Valor Total, botões e destaques usam a mesma cor primária
  - Design mais coeso e profissional

### Versão 2.6 - 2026-02-28
- 📱 **RESPONSIVIDADE MOBILE TOTAL REFINADA**:
  - Fontes fixas em 16px (previne zoom automático iOS)
  - Espaçamento compacto e otimizado
  - Layout totalmente ajustado para visualização sem scroll horizontal
  - Overflow-x: hidden em html e body
  - Quebra inteligente de linhas em todos os elementos
- 🎨 **DASHBOARD COMPLETAMENTE REORGANIZADO**:
  - Nova ordem lógica: Orçamento → Material → Lucro → Valor Total
  - Cores diferenciadas e sem efeito incandescente:
    - 🔵 Azul (#007bff): Total de Orçamentos
    - 🟪 Roxo (#6f42c1): Material Utilizado
    - 🟢 Verde (#28a745): Lucro Total
    - 🟠 Laranja (#ff9500): Valor Total
  - Mantido layout 2x2 (dois cards por linha)
  - Fontes mobile: 1.4rem (valor) / 0.7rem (label)
  - Padding otimizado: 0.9rem no mobile
- 📋 **HISTÓRICO EM CARDS**:
  - Substituição completa da tabela por cards modernos
  - Campos exibidos: Data, Modelo, Peso, Tempo, Custo Total, Preço Final
  - Botões integrados: Visualizar e Excluir
  - Grid responsivo: 1 coluna no mobile, múltiplas colunas no desktop
  - Design limpo com bordas coloridas
- 🔍 **FILTROS OTIMIZADOS MOBILE**:
  - Campo de pesquisa em linha completa
  - Botões "Filtro" e "Limpar" lado a lado
  - Layout flex com wrap para telas pequenas
  - Melhor usabilidade em dispositivos móveis
- 🐛 **CORREÇÕES CRÍTICAS**:
  - Form com `onsubmit="return false;"` previne reload
  - Função `saveCustomization()` valida e salva nome do app corretamente
  - `renderHistoryTable()` agora renderiza apenas cards (sem tabela)
  - Todos os listeners de eventos funcionando perfeitamente
- 🛠️ **MENU MOBILE APERFEIÇOADO**:
  - Desliza do lado direito (transform: translateX(100%))
  - Botão menu posicionado no canto superior direito
  - Botão dark mode no rodapé do sidebar (sem cortes)
  - Fecha automaticamente ao navegar

### Versão 2.4 - 2026-02-27
- 📱 **RESPONSIVIDADE MOBILE COMPLETA**: correção de todos os elementos cortados
  - Textos e campos ajustados para não ultrapassar a largura da tela
  - Prevenção de zoom automático no iOS (campos com font-size 16px)
  - Quebra de linha inteligente em labels e valores
  - Overflow-x: hidden em todos os elementos críticos
- 🎨 **Cards do Dashboard redesenhados e reorganizados**:
  - Ordem: Orçamento, Material Utilizado, Lucro Total, Valor Total
  - Cores distintas por card:
    - Azul (#4facfe): Total de Orçamentos
    - Roxo (#9b59b6): Material Utilizado
    - Verde (#28a745): Lucro Total
    - Laranja (#ff9500): Valor Total
  - 2 cards por linha (layout 2×2)
  - Ícones removidos para economia de espaço
  - Layout compacto: valor em destaque + label abaixo
  - Padding reduzido e fontes otimizadas para mobile
- 📊 **Histórico em cards mobile**:
  - Layout simplificado com informações essenciais
  - Exibe: Data, Peso, Tempo, Custo, Preço Final
  - Botões de ação compactos (Detalhes, Excluir)
  - Filtros reorganizados: campo de pesquisa em linha, botões Filtro e Limpar lado a lado
- 🖨️ **Exportação PDF corrigida**:
  - Margens ajustadas para A4 (1cm)
  - Fontes reduzidas para caber no papel
  - Valor final em destaque com tamanho proporcional
  - Padding e espaçamentos otimizados
  - Nenhum elemento cortado na impressão
- 🐛 **Correção de bugs críticos**:
  - Botão "Calcular" não executava função (adicionado ID `calculateBtn` e listener de submit no form)
  - Personalização não salvava nome do aplicativo (evento de submit configurado corretamente)
  - Cards mobile aparecem agora em telas pequenas (estrutura `.history-cards` adicionada ao HTML)
- 📱 **Menu mobile otimizado**:
  - Posicionado à direita (desliza da direita para esquerda)
  - Tela inteira quando aberto
  - Fecha automaticamente ao clicar em links
  - Botão dark mode reposicionado para não ser cortado
- 📊 **Gráficos ocultados no mobile** para melhor performance e foco nos cards
- 🔧 **Listas compactas em mobile**: filamentos e impressoras exibidos em lista em vez de cards grandes

### Versão 2.3
- ⏱️ **Campos de tempo numéricos**: horas (0-99h) e minutos (0-59min) para precisão total
- 🎨 **Orçamento impresso destacado**: valor final em fonte maior com bordas e gradiente
- 🧹 **Layout de impressão limpo**: removidas todas as linhas de separação desnecessárias
- 🔧 **Melhorias de usabilidade**: formulário reorganizado e otimizado

### Versão 2.2
- 🎨 **Layout otimizado**: peso e tempo lado a lado, taxa de falha e margem de lucro na mesma linha
- 🔧 **Seletores de tempo**: substituído campo dinâmico por seletores de horas (0-12h) e minutos (intervalos de 5min)
- 📊 **Cálculo linear**: taxa de falha + margem de lucro aplicados linearmente sobre custo base (ex: 15% + 35% = 50%)
- 🎨 **Cores do Dashboard atualizadas**:
  - Custo Total: laranja (#ff9500)
  - Lucro Total: verde padrão (#28a745)
  - Gráfico de evolução com cores correspondentes
- 🖨️ **Página de impressão limpa**: removidos menus, botões e linhas extras; layout minimalista e profissional

### Versão 2.1
- ✨ **Campo de tempo unificado**: aceita múltiplos formatos (2h 30min, 150min, 2.5h)
- ✨ **Taxa de falha**: contabilização automática de material desperdiçado
- ✨ **Cores de filamentos nos gráficos**: visualização com cores reais dos materiais
- ✨ **Indicadores do Dashboard aprimorados**: 
  - Total de Orçamentos
  - Valor Total acumulado
  - Lucro Total acumulado
  - Peso do Material utilizado
- 🎨 **Seletor visual de cores** para filamentos
- 🔧 Gráficos otimizados (altura fixa de 280px)
- 🔧 Schema atualizado para novos campos

### Versão 2.0
- ✨ Sistema de múltiplas impressoras
- ✨ Personalização completa (cores, logo, nome)
- ✨ Menu lateral recolhível
- ✨ Dashboard e histórico unificados
- ✨ Filtros avançados de período no histórico
- ✨ Configurações reorganizadas em abas
- ✨ Cálculo simplificado (removido custo por hora de impressão)
- 🔧 Melhorias de performance
- 🎨 Interface ainda mais polida

### Versão 1.0
- 🎉 Lançamento inicial
- ✅ Calculadora básica
- ✅ Gerenciamento de filamentos
- ✅ Histórico de cálculos
- ✅ Dashboard com estatísticas
- ✅ Modo escuro

## 📄 Licença

Este projeto foi desenvolvido como uma ferramenta personalizada de gestão de custos de impressão 3D.

---

**Desenvolvido com 💙 para a comunidade de impressão 3D**

*Última atualização: 2026-03-01 - Versão 2.7*
