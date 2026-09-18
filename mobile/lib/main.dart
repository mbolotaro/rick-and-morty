import 'package:flutter/material.dart';
import 'auth/auth_repository.dart';

void main() => runApp(const RickAndMortyApp());

class RickAndMortyApp extends StatelessWidget {
  const RickAndMortyApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Rick and Morty',
    theme: ThemeData(colorScheme: ColorScheme.fromSeed(seedColor: Colors.green)),
    home: const SignInPage(),
  );
}

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});
  @override
  State<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _auth = AuthRepository();
  bool _loading = false;
  String? _error;

  Future<void> _signIn() async {
    setState(() { _loading = true; _error = null; });
    try {
      final session = await _auth.signIn(_email.text, _password.text);
      if (!mounted) return;
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => AuthenticatedPage(repository: _auth, name: session.user.firstName)));
    } on AuthException catch (error) {
      setState(() => _error = error.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() { _email.dispose(); _password.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Center(child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: Padding(padding: const EdgeInsets.all(24), child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [const Text('Entrar', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)), const SizedBox(height: 24), TextField(controller: _email, keyboardType: TextInputType.emailAddress, decoration: const InputDecoration(labelText: 'E-mail')), TextField(controller: _password, obscureText: true, decoration: const InputDecoration(labelText: 'Senha')), if (_error != null) Padding(padding: const EdgeInsets.only(top: 12), child: Text(_error!, style: const TextStyle(color: Colors.red))), const SizedBox(height: 24), FilledButton(onPressed: _loading ? null : _signIn, child: Text(_loading ? 'Entrando...' : 'Entrar'))]))),
  );
}

class AuthenticatedPage extends StatelessWidget {
  const AuthenticatedPage({super.key, required this.repository, required this.name});
  final AuthRepository repository;
  final String name;
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Rick and Morty')), body: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [Text('Olá, $name'), const SizedBox(height: 12), const Text('Sessão protegida por tokens no armazenamento seguro.'), const SizedBox(height: 24), FilledButton.tonal(onPressed: () async { await repository.signOut(); if (context.mounted) Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const SignInPage())); }, child: const Text('Sair'))])));
}
