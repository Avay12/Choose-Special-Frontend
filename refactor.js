const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'components', 'templates');

function walkDir(dir) {
    let files = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && file !== 'animations') {
            files = files.concat(walkDir(filePath));
        } else if (file.endsWith('.tsx') && !file.includes('CardEnvelope') && !file.includes('AnimationPicker') && !file.includes('PresentationWrapper') && !file.includes('Renderer')) {
            files.push(filePath);
        }
    }
    return files;
}

const templateFiles = walkDir(templatesDir);

templateFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace import
    content = content.replace(/import CardEnvelope from "\.\.\/CardEnvelope";/g, 'import PresentationWrapper from "../PresentationWrapper";');
    
    // Add animationType to interface if it exists
    content = content.replace(/interface\s+(\w+Props)\s*{([^}]+)}/g, (match, p1, p2) => {
        if (!p2.includes('animationType')) {
            return `interface ${p1} {${p2}  animationType?: string;\n}`;
        }
        return match;
    });
    
    // Add animationType to destructured props
    content = content.replace(/(export default function \w+\({[^}]+)(}: \w+Props\))/, (match, p1, p2) => {
        if (!p1.includes('animationType')) {
            return `${p1}, animationType ${p2}`;
        }
        return match;
    });

    // Replace <CardEnvelope with <PresentationWrapper
    content = content.replace(/<CardEnvelope/g, '<PresentationWrapper animationType={animationType}');
    content = content.replace(/<\/CardEnvelope>/g, '</PresentationWrapper>');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Refactored', file);
});

// Refactor DynamicTemplateRenderer.tsx
const rendererFile = path.join(templatesDir, 'DynamicTemplateRenderer.tsx');
if (fs.existsSync(rendererFile)) {
    let rContent = fs.readFileSync(rendererFile, 'utf8');
    rContent = rContent.replace(/import CardEnvelope from "\.\/CardEnvelope";/g, 'import PresentationWrapper from "./PresentationWrapper";');
    
    // It might not have interface Props with animationType, let's see how it's structured.
    // I'll just blindly replace <CardEnvelope with <PresentationWrapper
    rContent = rContent.replace(/<CardEnvelope/g, '<PresentationWrapper animationType={data?.animationType}');
    rContent = rContent.replace(/<\/CardEnvelope>/g, '</PresentationWrapper>');
    
    fs.writeFileSync(rendererFile, rContent, 'utf8');
    console.log('Refactored DynamicTemplateRenderer.tsx');
}
