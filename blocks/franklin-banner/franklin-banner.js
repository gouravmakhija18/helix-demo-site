export default function decorate(block) {
    debugger;
    if (block) {
        const $picture = block.querySelector('picture');
        if ($picture) {
            const $parent = $picture.parentElement;
            $parent.classList.add('image-wrapper');
        }
    }
};