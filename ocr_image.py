import pytesseract
from PIL import Image, UnidentifiedImageError

def extract_text_from_image(image_path, lang='eng'):
    """
    Extrai texto de uma imagem usando pytesseract.

    :param image_path: Caminho para o arquivo de imagem.
    :param lang: Código do idioma para o Tesseract (ex: 'eng', 'por').
    :return: O texto extraído ou None se ocorrer um erro.
    """
    try:
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img, lang=lang)
        return text
    except FileNotFoundError:
        print(f"Erro: O arquivo de imagem não foi encontrado em '{image_path}'")
        return None
    except UnidentifiedImageError:
        print(f"Erro: Não foi possível abrir ou ler o arquivo de imagem em '{image_path}'. Verifique se é um formato de imagem válido.")
        return None
    except pytesseract.TesseractNotFoundError:
        print("Erro: Executável do Tesseract OCR não encontrado.")
        print("Verifique se o Tesseract está instalado e no PATH do sistema.")
        return None
    except Exception as e:
        print(f"Ocorreu um erro inesperado durante o processamento da imagem: {e}")
        return None

if __name__ == "__main__":
    print("--- Extrator de Texto de Imagem (OCR) ---")
    image_file_path = input("Digite o caminho para o arquivo de imagem: ")

    # Validação simples do caminho
    if not image_file_path.strip():
        print("Nenhum caminho de imagem fornecido. Encerrando.")
    else:
        language_code = input("Digite o código do idioma do texto na imagem (ex: 'eng' para inglês, 'por' para português, deixe em branco para 'eng'): ").strip()
        if not language_code:
            language_code = 'eng' # Padrão para inglês

        print(f"\nProcessando imagem '{image_file_path}' com o idioma '{language_code}'...")
        extracted_text = extract_text_from_image(image_file_path, lang=language_code)

        if extracted_text is not None:
            print("\n--- Texto Extraído ---")
            if extracted_text.strip():
                print(extracted_text)
            else:
                print("(Nenhum texto detectado na imagem)")
            print("--- Fim do Texto ---")
