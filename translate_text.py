import translators as ts

def main():
    input_text = input("Digite o texto que você gostaria de traduzir: ")
    target_language = 'pt' # Português do Brasil

    if not input_text.strip():
        print("Nenhum texto fornecido. Encerrando.")
        return

    try:
        # Usando o tradutor do Google (o padrão para a função translate_text)
        translated_text = ts.translate_text(input_text, to_language=target_language)
        print(f"\nTexto traduzido para {target_language}:")
        print(translated_text)
    except Exception as e:
        print(f"\nOcorreu um erro durante a tradução:")
        print(e)
        print("Por favor, verifique sua conexão com a internet ou tente um texto diferente.")
        print("Alguns dos tradutores podem estar temporariamente indisponíveis ou podem ter bloqueado o acesso.")

if __name__ == "__main__":
    main()
