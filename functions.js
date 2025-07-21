function interpretar(codigo) {
  const etiquetasPersonalizadas = {
    bloque: "div",
    lado: "div",
    titulo: "h1",
    texto: "p",
  }

  const conEstilos = codigo.replace(
    /<(\w+)([^>]*)>/g,
    (_, tag, atributosRaw) => {
      if (!(tag in etiquetasPersonalizadas)) return `<${tag}>`

      // get attributes (ie: fondo="azul" color="white")
      const atributos = {}
      const regexAttr = /(\w+)="(.*?)"/g
      let match
      while ((match = regexAttr.exec(atributosRaw))) {
        atributos[match[1]] = match[2]
      }

      // generate inline styles
      const style = []
      if (atributos.fondo) {
        style.push(`background-color: ${atributos.fondo}`)
      }
      if (atributos.color) {
        style.push(`color: ${atributos.color}`)
      }
      if (atributos.borde) {
        style.push(`border: 1px solid ${atributos.borde}`)
      }
      const styleAttr = style.length > 0 ? ` style="${style.join("; ")}"` : ""

      // generate final tag
      const tagFinal = etiquetasPersonalizadas[tag]
      const classAttr = tagFinal === "div" ? ` class="${tag}"` : ""

      return `<${tagFinal}${classAttr}${styleAttr}>`
    }
  )

  return `
        <html>
          <head>
            <style>
            body {
              font-family: sans-serif;
              padding: 20px;
            }

            .cuerpo {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }

            .bloque {
              display: flex;
              flex-direction: column;

              * {
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 5px;
              }
            }

            .lado {
              display: flex;
              flex-direction: row;
              gap: 10px;

              * {
                padding: 10px;
                border-radius: 5px;
              }
            }

            p {
              margin: 0;
            }

            .titulo {
              font-size: 24px;
            }

            </style>
          </head>
          <body>
            ${conEstilos
              .replaceAll("<cuerpo>", '<div class="cuerpo">')
              .replaceAll("</cuerpo>", "</div>")
              .replaceAll("</bloque>", "</div>")
              .replaceAll("</lado>", "</div>")
              .replaceAll("</texto>", "</p>")
              .replaceAll("</titulo>", "</h1>")}
          </body>
        </html>
      `
}

const editor = document.getElementById("editor")
const preview = document.getElementById("preview")

function actualizarVista() {
  const html = interpretar(editor.value)
  preview.srcdoc = html
}

editor.addEventListener("input", actualizarVista)
actualizarVista() // first render
