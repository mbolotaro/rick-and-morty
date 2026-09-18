import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pickle_verso/app/router.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';
import 'package:pickle_verso/core/ui/app_background.dart';
import 'package:pickle_verso/core/ui/app_button.dart';
import 'package:pickle_verso/features/auth/presentation/auth_controller.dart';
import 'package:pickle_verso/features/auth/presentation/auth_panel.dart';
import 'package:pickle_verso/features/auth/presentation/auth_validators.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    if (!_formKey.currentState!.validate()) return;
    await ref
        .read(authControllerProvider.notifier)
        .signIn(
          email: _emailController.text,
          password: _passwordController.text,
        );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(authControllerProvider);

    return Scaffold(
      body: AppBackground(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppPrimitives.space5),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 440),
                child: AuthPanel(
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Align(
                          child: Image.asset(
                            'assets/images/pickle-rick.webp',
                            height: 126,
                            errorBuilder: (_, _, _) => Icon(
                              Icons.science_rounded,
                              size: 76,
                              color: context.colors.accent,
                            ),
                          ),
                        ),
                        const SizedBox(height: AppPrimitives.space3),
                        Text(
                          'PICKLEVERSE',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: AppPrimitives.space2),
                        Text(
                          'Entre para explorar todas as realidades.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: context.colors.contentSecondary,
                          ),
                        ),
                        const SizedBox(height: AppPrimitives.space5),
                        TextFormField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          autofillHints: const [AutofillHints.email],
                          decoration: const InputDecoration(
                            labelText: 'E-mail',
                            prefixIcon: Icon(Icons.alternate_email_rounded),
                          ),
                          validator: AuthValidators.email,
                        ),
                        const SizedBox(height: AppPrimitives.space4),
                        TextFormField(
                          controller: _passwordController,
                          obscureText: _obscurePassword,
                          autofillHints: const [AutofillHints.password],
                          onFieldSubmitted: (_) => _submit(),
                          decoration: InputDecoration(
                            labelText: 'Senha',
                            prefixIcon: const Icon(Icons.lock_outline_rounded),
                            suffixIcon: IconButton(
                              onPressed: () => setState(
                                () => _obscurePassword = !_obscurePassword,
                              ),
                              icon: Icon(
                                _obscurePassword
                                    ? Icons.visibility_rounded
                                    : Icons.visibility_off_rounded,
                              ),
                            ),
                          ),
                          validator: AuthValidators.password,
                        ),
                        if (state.errorMessage != null) ...[
                          const SizedBox(height: AppPrimitives.space3),
                          Text(
                            state.errorMessage!,
                            style: TextStyle(
                              color: context.colors.danger,
                              fontWeight: FontWeight.w700,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                        const SizedBox(height: AppPrimitives.space5),
                        AppButton(
                          label: 'Entrar no PickleVerso',
                          onPressed: _submit,
                          isLoading: state.isSubmitting,
                        ),
                        const SizedBox(height: AppPrimitives.space2),
                        TextButton(
                          onPressed: state.isSubmitting
                              ? null
                              : () => context.push(AppRoutes.signUp),
                          child: const Text('Criar uma conta'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
