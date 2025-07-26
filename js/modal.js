        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.style.display = "block";
            setTimeout(() => {
                modal.classList.add("active");
            }, 10);
            document.body.style.overflow = "hidden";
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove("active");
            setTimeout(() => {
                modal.style.display = "none";
                const mainImage = modal.querySelector('.main-image img');
                mainImage.classList.remove('zoomed');
            }, 300);
            document.body.style.overflow = "auto";
        }

        function changeImage(mainId, src, element) {
            document.getElementById(mainId).src = src;
            
            // Actualizar miniaturas activas
            const thumbnails = element.parentElement.querySelectorAll('.thumbnail');
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            element.classList.add('active');
            
            const mainImage = document.getElementById(mainId);
            mainImage.classList.remove('zoomed');
        }

        function toggleZoom(element) {
            const img = element.querySelector('img');
            img.classList.toggle('zoomed');
        }

        window.onclick = function(event) {
            document.querySelectorAll('.modal').forEach(modal => {
                if (event.target === modal) {
                    closeModal(modal.id);
                }
            });
        }

        document.onkeydown = function(evt) {
            evt = evt || window.event;
            if (evt.key === "Escape") {
                document.querySelectorAll('.modal').forEach(modal => {
                    if (modal.style.display === "block") {
                        closeModal(modal.id);
                    }
                });
            }
        };