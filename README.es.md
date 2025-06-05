# ContentGuard v0.1.2

**Moderación profesional de contenido y detección de spam para aplicaciones modernas.**

ContentGuard analiza textos en busca de spam, acoso y patrones maliciosos. Combina un potente motor de reglas con plugins de aprendizaje automático opcionales para ofrecer resultados rápidos y precisos.

## Instalación

```bash
npm install content-guard
```

## Inicio rápido

```javascript
const { ContentGuard } = require('content-guard');
const guard = new ContentGuard('moderate');
const resultado = await guard.analyze('Hola mundo');
console.log(resultado.isSpam);
```

## Características principales

- Varios presets desde **permisivo** hasta **estricto**
- Detección contextual mediante procesamiento de lenguaje natural
- Motor modular con filtros de teclado, sentimiento y acoso
- Plugins ML opcionales para sentimiento de emojis, chequeos interculturales y toxicidad
- Normalización de confusables Unicode para impedir la ofuscación
- CLI para procesamiento por lotes y scripts
- Ligero y rápido, ideal para entornos sin servidor
- Tipos TypeScript incluidos

## Variantes v4.5

ContentGuard v4.5 ofrece cuatro variantes para equilibrar velocidad y precisión:

| Variante        | Precisión | Tiempo medio | Caso de uso                                   |
|-----------------|----------:|-------------:|-----------------------------------------------|
| **v4.5-turbo**    | ~91%      | 0.02ms       | Chats en tiempo real y flujos de alto volumen |
| **v4.5-fast**     | ~90%      | 0.06ms       | Pasarelas API y microservicios                |
| **v4.5-balanced** | ~93%      | 0.25ms       | Despliegues en producción (por defecto)       |
| **v4.5-large**    | ~94%      | 1.32ms       | Moderación crítica y empresarial              |

Seleccione una variante al crear la instancia o desde la CLI.

## Plugins y casos de uso

ContentGuard incluye un sistema de plugins modular. Active solo lo necesario:

| Plugin                 | Descripción y caso de uso típico                              |
|------------------------|----------------------------------------------------------------|
| **Obscenity**          | Detecta lenguaje ofensivo. Útil para normas comunitarias.       |
| **Sentiment**          | Puntúa el tono del texto. Perfecto para analíticas de chat.     |
| **Harassment**         | Señala frases de acoso u odio. Esencial en redes sociales.      |
| **Social Engineering** | Encuentra intentos de phishing o estafa. Filtros de correo.     |
| **Keyboard Spam**      | Identifica pulsaciones aleatorias. Formularios y registros.     |
| **Emoji Sentiment**    | Interpreta el tono de los emojis. Añade matices al análisis.    |
| **Cross‑Cultural**     | Revisa términos sensibles culturalmente. Implantaciones globales|
| **ML Toxicity**        | Clasificación de toxicidad con ML. Mayor precisión.            |
| **Confusables**        | Normaliza caracteres Unicode similares. Evita la ofuscación.    |

## Uso de CLI

```bash
npx content-guard "Un texto" --preset strict --variant fast
```

Consulte el directorio `examples/` para ejemplos de integración.

## Configuración

Cada preset puede personalizarse. Revise `lib/presets` y ajuste pesos de plugins, umbrales y opciones de preprocesamiento según sus necesidades.

## Licencia

ContentGuard se distribuye bajo la licencia MIT.

---

**Otros idiomas:** [English](README.md) | [Français](README.fr.md) | [中文](README.cn.md)
