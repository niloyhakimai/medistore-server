import app from './app';

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();