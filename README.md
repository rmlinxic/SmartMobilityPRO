# SmartMobilityPRO

Aplicativo móvel para mobilidade urbana inteligente, desenvolvido com React Native e Expo Router. A aplicação utiliza navegação baseada em arquivos (file-based routing) e é estruturada para suportar múltiplas telas nativas em Android e iOS a partir de uma única base de código.

## Stack

| Tecnologia | Versão / Papel |
|---|---|
| React Native | Framework UI multiplataforma |
| Expo SDK | Runtime e toolchain |
| Expo Router | Navegação file-based (similar ao Next.js) |
| JavaScript | Linguagem principal |

## Estrutura do Repositório

```
├── SmartMobility/
│   ├── app/          # Rotas e telas (Expo Router)
│   ├── components/   # Componentes reutilizáveis
│   └── assets/       # Imagens e fontes
└── .expo/
```

## Pré-requisitos

- Node.js >= 18
- Expo CLI: `npm install -g expo-cli`
- Dispositivo físico ou emulador (Android/iOS)

## Execução local

```bash
# Instalar dependências
cd SmartMobility
npm install

# Iniciar servidor de desenvolvimento
npx expo start
```

Escaneie o QR code com o aplicativo Expo Go (Android/iOS) ou execute diretamente no emulador.
