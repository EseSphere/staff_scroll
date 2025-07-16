<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SecureClean Services</title>
    <style>
        /* Reset some default styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #f5f7fa;
            color: #333;
            line-height: 1.6;
        }

        header {
            background-color: #004080;
            color: white;
            padding: 20px 0;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        header h1 {
            font-size: 2.5rem;
            letter-spacing: 2px;
        }

        nav {
            margin-top: 10px;
        }

        nav a {
            color: #cce6ff;
            text-decoration: none;
            margin: 0 15px;
            font-weight: 600;
            transition: color 0.3s ease;
        }

        nav a:hover {
            color: #ffcc00;
        }

        .hero {
            background: url('https://images.unsplash.com/photo-1596495578063-7f5f4ec00e47?auto=format&fit=crop&w=1470&q=80') no-repeat center center/cover;
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
            font-size: 2rem;
            font-weight: bold;
        }

        main {
            max-width: 1100px;
            margin: 40px auto;
            padding: 0 20px;
        }

        .services {
            display: flex;
            gap: 40px;
            justify-content: space-around;
            flex-wrap: wrap;
        }

        .service {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            flex: 1 1 300px;
            text-align: center;
            transition: transform 0.3s ease;
        }

        .service:hover {
            transform: translateY(-10px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .service h2 {
            margin-bottom: 15px;
            color: #004080;
        }

        .service p {
            color: #555;
        }

        footer {
            background-color: #004080;
            color: white;
            text-align: center;
            padding: 15px 0;
            margin-top: 60px;
            font-size: 0.9rem;
        }

        @media (max-width: 600px) {
            .services {
                flex-direction: column;
                gap: 20px;
            }
        }
    </style>
</head>

<body>
    <header>
        <h1>SecureClean Services</h1>
        <nav>
            <a href="#security">Security</a>
            <a href="#cleaning">Cleaning</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>

    <section class="hero">
        Protecting & Maintaining Your Business with Excellence
    </section>

    <main>
        <section id="security" class="services">
            <div class="service">
                <h2>Professional Security Services</h2>
                <p>
                    Our highly trained security personnel ensure your property, assets, and people are protected 24/7 with state-of-the-art technology and vigilant patrols.
                </p>
            </div>
            <div class="service" id="cleaning">
                <h2>Expert Cleaning Services</h2>
                <p>
                    From office spaces to industrial facilities, our cleaning team delivers spotless results using eco-friendly products tailored to your needs.
                </p>
            </div>
        </section>

        <section id="contact" style="margin-top: 50px; text-align: center;">
            <h2>Contact Us</h2>
            <p>Ready to secure and clean your space? Reach out today!</p>
            <p>Email: <a href="mailto:info@secureclean.com">info@secureclean.com</a></p>
            <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
        </section>
    </main>

    <footer>
        &copy; 2025 SecureClean Services. All rights reserved.
    </footer>
</body>

</html>