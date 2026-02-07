
# CMMC Alcanena/Minde - Elite Performance

Esta é a plataforma oficial de gestão e acompanhamento de atletas do Centro Municipal de Marcha e Corrida (CMMC).

## 🚀 Como colocar o site online (Deployment)

Para que o site tenha um endereço (URL) público, siga estes passos simples:

1. **Crie uma conta na Vercel:** Vá a [vercel.com](https://vercel.com) e registe-se (grátis).
2. **Novo Projeto:** Clique em "Add New" -> "Project".
3. **Upload:** Se não usa GitHub, pode simplesmente arrastar a pasta deste projeto para a área de upload da Vercel.
4. **Variáveis de Ambiente:** No painel de configuração da Vercel, adicione a chave:
   - `API_KEY`: (A sua chave do Google Gemini para a análise de IA funcionar).
5. **Pronto!** A Vercel vai dar-lhe um link como `cmmc-app.vercel.app`.

## ✨ Funcionalidades
- **Mural Social:** Partilha de conquistas entre atletas.
- **Gestão de Presenças:** Controlo de assiduidade por pólo (Alcanena/Minde).
- **Análise com IA:** Feedback técnico personalizado via Google Gemini.
- **PWA Ready:** Pode ser instalado no telemóvel como uma App (através do menu "Adicionar ao ecrã principal" no browser).

## 🛠️ Tecnologias
- React 19 + TypeScript
- Tailwind CSS
- Google Gemini API
- PWA (Progressive Web App)
