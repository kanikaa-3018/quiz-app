import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'wouter';

const AdminForm = ({ type, formData, setFormData, handleSubmit }) => {
  const isRegister = type === 'register';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200 px-4">
      <Card className="w-full max-w-lg shadow-2xl rounded-3xl bg-white">
        <CardContent className="p-8">
          <h2 className="text-3xl font-semibold text-center mb-6 text-blue-700">
            {isRegister ? 'Admin Register' : 'Admin Login'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiUser /> Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiMail /> Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiLock /> Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-md"
            >
              {isRegister ? 'Create Account' : 'Login'}
            </Button>
          </form>

          <div className="text-sm text-center mt-4 text-gray-600">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <Link href="/admin/login" className="text-blue-600 hover:underline font-medium">
                  Login
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link href="/admin/register" className="text-blue-600 hover:underline font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminForm;
