    function createLoader() {
        // Set background image for the body
        document.body.style.backgroundImage = 'url("/jcms/plugins/newRainbowPlugin/images/mountain__bg.jpg")';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.height = '100vh';
        document.body.style.margin = '0';

        // Create and style the loader
        const loader = document.createElement('div');
        loader.setAttribute('id', 'loader');

        const loaderStyle = {
            position: 'fixed',
            top: '0',
            left: '0',
            height: '5px',
            backgroundColor: 'blue',
            width: '0',
            transition: 'width 3s'
        };

        for (const [key, value] of Object.entries(loaderStyle)) {
            loader.style[key] = value;
        }

        document.body.appendChild(loader);

        // Simulate a loading process
        window.addEventListener('load', () => {
            loader.style.width = '100%';
        });

        // Optionally, hide the loader after loading completes
        loader.addEventListener('transitionend', () => {
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1500); // Adjust the timeout as needed
        });
    }

    createLoader();