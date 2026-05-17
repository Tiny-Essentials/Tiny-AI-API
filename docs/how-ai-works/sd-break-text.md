#### Credits: https://www.reddit.com/r/StableDiffusion/comments/13a9avh/comment/l46thmx/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button

# 📝 Understanding Prompt Chunking and the 75-Character Limit

When writing long prompts, managing how the system reads your descriptions is crucial for getting accurate and consistent results. Here is a friendly guide on how prompt length affects your output and how to control it!

## ✂️ The "Chunking" Effect

Whenever a prompt description exceeds **75 characters** (or tokens, depending on the engine), the system automatically splits it into separate segments, which we call **"chunks."**

Once this separation happens, the elements inside your description are no longer processed together as a single, unified idea. Instead, the system considers the separated parts independently.

## 🛡️ Example: The Armor Dilemma

Imagine you are trying to describe a character's armor with the following prompt:
> `black armor, golden filigreed, helmet with visor`

**❌ If the prompt is split (Unintended Chunking):**
If the system separates `black armor` into one chunk and `golden filigreed` into another, the connection between those details is lost. The result? 
- You might get completely black armor.
- The golden filigree might only appear on the helmet.
- The helmet itself might not even be black!

**✅ If the prompt stays together (Unified Context):**
If those details remain in the same chunk, the system understands the combined context. You will get exactly what you envisioned: the entire armor, including the helmet, will be black and covered in golden filigree.

## 🛠️ The Solution: Controlling the Chunks

To prevent the system from arbitrarily splitting your carefully crafted descriptions, you can manually manage these chunks. 

By inserting a **`BREAK`** command between distinct parts of your overall prompt, you can safely isolate different elements (like the character's body, their outfit, and the background) without breaking the specific details of each one. This gives you much greater control and highly consistent results!

---

## 💡 Practical Prompt Examples

Let's look at how to apply this when generating a detailed character design. We want to generate a specific character with a white body, hot pink eyes, no cutie mark, and feline predator instincts, placed in a dark, atmospheric environment.

### ❌ The "Bleeding" Prompt (Without `BREAK`)

> `masterpiece, high quality, micro pony, pure white body, completely blank flank, no cutie mark, hot pink eyes, standing on a rocky mountain, dark sky, gothic castle in the background, dark shadows`

**What might go wrong here?** 
Because this prompt is long, the system will slice it into chunks. If `hot pink eyes` ends up in the same chunk as `dark sky` or `gothic castle`, the system might get confused. You could end up with a pink castle, a pink sky, or the character's white body might turn gray because of the `dark shadows` mixing into the character's chunk.

### ✅ The Controlled Prompt (Using `BREAK`)

> `masterpiece, high quality, micro pony, pure white body, completely blank flank, no cutie mark, hot pink eyes BREAK standing on a rocky mountain, dark sky, gothic castle in the background, dark shadows`

**Why this works beautifully:**
By placing the `BREAK` command right after the character's physical description and before the environment description, you force the AI to process them as two distinct, closed concepts. 
1. **Chunk 1:** Calculates the character perfectly (pure white body, hot pink eyes, feline posture).
2. **Chunk 2:** Calculates the background perfectly (rocky mountain, dark sky, gothic castle).

The traits from Chunk 1 will not bleed into Chunk 2, ensuring your character retains her exact design while perfectly situated in the dark scenery!