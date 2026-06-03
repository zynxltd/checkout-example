<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sign in — YouGarden preview</title>
    <link rel="stylesheet" href="{{ asset('css/yg-fonts.css') }}">
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            font-family: var(--yg-font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
            background: #f2e7d8;
            color: #483f3a;
        }
        .login {
            width: 100%;
            max-width: 400px;
            padding: 32px 28px;
            border-radius: 12px;
            background: #fff;
            box-shadow: 0 8px 32px rgba(72, 63, 58, 0.12);
        }
        .login__logo {
            display: block;
            height: 44px;
            width: auto;
            margin: 0 auto 24px;
        }
        .login__title {
            margin: 0 0 8px;
            font-family: var(--yg-font-display, inherit);
            font-size: 1.35rem;
            font-weight: 600;
            text-align: center;
            color: #264f1c;
        }
        .login__lead {
            margin: 0 0 24px;
            font-size: 14px;
            line-height: 1.45;
            text-align: center;
            color: #7a726c;
        }
        .login__error {
            margin: 0 0 16px;
            padding: 10px 12px;
            border-radius: 8px;
            background: #fde8ef;
            font-size: 13px;
            color: #a4133c;
        }
        .login__field {
            margin-bottom: 16px;
        }
        .login__label {
            display: block;
            margin-bottom: 6px;
            font-size: 13px;
            font-weight: 600;
            color: #483f3a;
        }
        .login__input {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid #e0d6cb;
            border-radius: 8px;
            font-family: inherit;
            font-size: 16px;
            color: #483f3a;
            background: #fff;
        }
        .login__input:focus {
            outline: 2px solid #264f1c;
            outline-offset: 1px;
            border-color: #264f1c;
        }
        .login__submit {
            width: 100%;
            margin-top: 8px;
            padding: 14px 16px;
            border: none;
            border-radius: 8px;
            background: #264f1c;
            color: #fff;
            font-family: inherit;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
        }
        .login__submit:hover {
            background: #1f3f17;
        }
        .login__note {
            margin: 20px 0 0;
            font-size: 12px;
            line-height: 1.4;
            text-align: center;
            color: #9a928c;
        }
    </style>
</head>
<body>
    <div class="login">
        <img
            class="login__logo"
            src="{{ asset('images/yougarden-logo.png') }}"
            alt="YouGarden"
            width="180"
            height="48"
        >
        <h1 class="login__title">Preview access</h1>
        <p class="login__lead">Sign in to view the cart drawer and checkout prototype.</p>

        @if ($errors->any())
        <p class="login__error" role="alert">{{ $errors->first() }}</p>
        @endif

        <form method="post" action="{{ route('demo.login.submit') }}">
            @csrf
            @if (!empty($redirect))
            <input type="hidden" name="redirect" value="{{ $redirect }}">
            @endif

            <div class="login__field">
                <label class="login__label" for="username">Username</label>
                <input
                    class="login__input"
                    type="text"
                    id="username"
                    name="username"
                    value="{{ old('username') }}"
                    autocomplete="username"
                    required
                    autofocus
                >
            </div>

            <div class="login__field">
                <label class="login__label" for="password">Password</label>
                <input
                    class="login__input"
                    type="password"
                    id="password"
                    name="password"
                    autocomplete="current-password"
                    required
                >
            </div>

            <button type="submit" class="login__submit">Sign in</button>
        </form>

        <p class="login__note">Internal demo — not a customer-facing login.</p>
    </div>
</body>
</html>
