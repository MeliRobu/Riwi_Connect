import { navbar } from "./navbar";
export function layout(content = null) {
    return `
 <div class="grid grid-cols-[clamp(220px,16vw,300px)_1fr] h-full w-full">
  ${navbar()}
  ${content}
</div>
    
    `;
}