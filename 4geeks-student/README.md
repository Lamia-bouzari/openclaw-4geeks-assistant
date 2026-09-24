# 4Geeks Student API Skill

OpenClaw Skill para integrar con 4Geeks Academy API usando tokens de acceso limitados.

## 📦 Contenido

1. **`SKILL.md`** - Documentación principal de la skill
2. **`index.js`** - Implementación de la skill con estrategias de fallback
3. **`CONFIGURATION.md`** - Configuración de entorno y seguridad
4. **`docs/SKILL_LOG.md`** - Historial completo del proceso de descubrimiento

## 🎯 Propósito

Permitir que OpenClaw intente conectarse a 4Geeks Academy usando tokens de acceso limitados (session tokens) que solo funcionan en contexto de navegador.

## ⚠️ Limitaciones Conocidas

- **Token inválido externamente**: El token `2055366b3d6dd8f98efe236379db950793da3752` es un session token
- **Necesita sesión activa**: Solo funciona con cookies y contexto de navegador completo
- **Documentación incompleta**: La información de clase es limitada

## 🔧 Estrategias Implementadas

1. **Autenticación estándar** - Headers básicos
2. **Autenticación con sesión** - Añade If-None-Match
3. **Simulación de navegador** - Headers completos + parámetros exactos

## 🚀 Uso

```javascript
const FourGeeksStudentSkill = require('./index.js');
const skill = new FourGeeksStudentSkill({
  token: process.env.FOUR_GEEKS_TOKEN
});

// Intenta múltiples estrategias
const result = await skill.authenticateWithFallback();
```

## 📝 Documentación Adicional

Ver `docs/SKILL_LOG.md` para el historial completo del proceso de descubrimiento de la API.

## 🔗 Enlaces

- [GitHub del autor](https://github.com/theazec34)
- [OpenClaw Documentation](https://docs.openclaw.ai)
- [4Geeks Academy](https://4geeks.com)

---

*Skill creada por Gojo/OpenClaw para Alfredo - 2026-06-29*
