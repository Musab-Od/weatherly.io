export const search = {
  init(callback) {
    const input = document.querySelector('.initial-search-container input');
    const icon = document.querySelector('.initial-search-container i');

    const handle = () => {
      const city = input.value.trim();
      if (city) {
        callback(city, true); // true = initial search
      }
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handle();
      }
    });

    icon.addEventListener('click', handle);
  },
};
