# Gerador de Imagens Estilo Mangá/Anime

## Descrição

Esta aplicação web permite aos usuários gerar imagens com base em descrições textuais, com opções para emular estilos artísticos específicos, como o de Gamon Sakurai, ou gerar imagens fotorealistas. Os usuários também podem enviar suas próprias imagens para substituir as geradas. O projeto utiliza a API Text-to-Image da DeepAI para a geração de imagens.

## Features

- Geração de imagens a partir de texto.
- Seleção de estilos de arte (Gamon Sakurai, Photorealistic).
- Campos de entrada para diálogo, pensamento, descrição de cenário e aparência do personagem.
- Visualização da imagem gerada.
- Opção para substituir a imagem gerada por uma imagem local.
- Interface responsiva e estilizada com Bootstrap e CSS customizado.

## Como Usar

1.  **Preencha os Campos de Texto:**
    *   **Texto do Diálogo:** Insira o diálogo que o personagem deve estar falando.
    *   **Texto do Pensamento:** Insira o pensamento interno do personagem.
    *   **Descrição do Cenário:** Descreva o ambiente ou a cena onde a imagem se passa.
    *   **Aparência e Vestimenta do Personagem:** Detalhe como o personagem deve se parecer e o que deve estar vestindo.

2.  **Selecione o Estilo de Arte:**
    *   Use o menu dropdown "Estilo de Arte" para escolher entre "Gamon Sakurai" ou "Photorealistic".

3.  **Gerar Imagem:**
    *   Clique no botão "Gerar Imagem". A imagem aparecerá na área abaixo do botão.
    *   **Nota:** A primeira geração pode demorar um pouco enquanto a API processa o pedido.

4.  **Substituir por Imagem Local:**
    *   Clique no botão "Escolher arquivo" (ou similar, dependendo do seu navegador) abaixo da área da imagem.
    *   Selecione um arquivo de imagem do seu computador. A imagem escolhida substituirá a imagem na área de visualização.

## Configuração da Chave de API (API Key Configuration)

Para que a funcionalidade de geração de imagens pela API funcione, você **PRECISA** configurar sua própria chave de API do DeepAI.

1.  Obtenha uma chave de API gratuita no site [DeepAI.org](https://deepai.org/). Você precisará se registrar.
2.  Abra o arquivo `script.js` no seu editor de código.
3.  Localize a linha:
    ```javascript
    const DEEP_AI_API_KEY = 'YOUR_API_KEY_HERE';
    ```
4.  Substitua `'YOUR_API_KEY_HERE'` pela sua chave de API real, mantendo as aspas. Por exemplo:
    ```javascript
    const DEEP_AI_API_KEY = 'abcdef12-3456-7890-abcd-ef1234567890';
    ```

### Aviso de Segurança

**NÃO FAÇA COMMIT da sua chave de API diretamente para um repositório PÚBLICO no GitHub se você não quiser que ela seja exposta.** Para projetos públicos, o ideal é usar um proxy de backend para proteger sua chave, onde a chave de API fica armazenada no servidor e não no código client-side.

Este projeto é puramente client-side para simplicidade de demonstração e facilidade de deployment no GitHub Pages. **Se o seu repositório for público, qualquer pessoa poderá ver sua chave de API se ela estiver no arquivo `script.js` e você fizer o commit dela.** Considere manter seu repositório privado se estiver incluindo sua chave diretamente.

## Deployment no GitHub Pages

1.  Faça o commit e push de todos os arquivos do projeto (`index.html`, `style.css`, `script.js`, `README.md`) para o seu repositório no GitHub.
2.  No seu repositório GitHub, vá em "Settings" (Configurações) no menu superior.
3.  Na barra lateral esquerda, clique em "Pages" (Páginas) sob a seção "Code and automation" (Código e automação).
4.  Em "Build and deployment" (Construção e implantação), na seção "Source" (Fonte), selecione "Deploy from a branch" (Implantar a partir de um branch).
5.  **Branch:** Selecione o branch que contém seus arquivos (geralmente `main` ou `master`).
6.  **Folder:** Selecione `/ (root)`.
7.  Clique em "Save" (Salvar).
8.  Aguarde alguns minutos para o site ser construído e publicado. O URL do seu site publicado (por exemplo, `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`) será exibido na mesma página. Pode ser necessário atualizar a página para ver o link.

Lembre-se que, devido à configuração da chave de API ser client-side, a funcionalidade de geração de imagem só funcionará no site publicado se a chave de API tiver sido corretamente inserida no `script.js` *antes* do commit e push.
