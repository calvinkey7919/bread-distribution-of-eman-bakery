# Contributing to Eman Bakery Distribution System

Thank you for your interest in contributing to the Eman Bakery Distribution System! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- System information (OS, Python version)
- Screenshots if applicable

### Suggesting Enhancements

We welcome enhancement suggestions! Please create an issue with:
- A clear description of the enhancement
- Use case and benefits
- Any relevant examples or mockups

### Pull Requests

1. **Fork the repository** and create a new branch
2. **Make your changes** with clear, descriptive commits
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** with:
   - Clear description of changes
   - Reference to any related issues
   - Screenshots for UI changes

## Development Guidelines

### Code Style

- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and concise

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test on multiple browsers for UI changes
- Verify both development and production modes

### Documentation

- Update README.md for major features
- Update USER_GUIDE.md for user-facing changes
- Add inline comments for complex code
- Update CHANGELOG.md

### Commit Messages

Write clear, descriptive commit messages:
```
Add feature: Brief description

Detailed explanation of what changed and why.
```

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bread-distribution-of-eman-bakery.git
   cd bread-distribution-of-eman-bakery
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run tests**
   ```bash
   python -m pytest test_app.py -v
   ```

5. **Start development server**
   ```bash
   export FLASK_DEBUG=true  # Linux/Mac
   set FLASK_DEBUG=true     # Windows
   python app.py
   ```

## Feature Roadmap

Areas where contributions are especially welcome:

### High Priority
- Database integration (PostgreSQL, SQLite)
- User authentication system
- Advanced reporting features
- Export functionality (CSV, PDF)

### Medium Priority
- Email notifications
- Inventory alerts
- Search and filtering
- Data validation improvements

### Nice to Have
- Mobile application
- API documentation
- Internationalization
- Theme customization

## Code Review Process

All submissions require review. We use GitHub pull requests for this purpose:

1. Maintainers will review your code
2. You may be asked to make changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged in CHANGELOG.md

## Questions?

Feel free to:
- Open an issue for questions
- Ask in pull request comments
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🍞
