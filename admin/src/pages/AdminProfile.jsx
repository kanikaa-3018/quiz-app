import React, { useEffect, useState } from 'react';
import API from '../lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Edit3,
  Save,
  XCircle,
  Book,
  Award,
  GraduationCap,
  Users,
  Mail,
} from 'lucide-react';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        setAdmin(res.data);
        setFormData(res.data);
      } catch (err) {
        alert('Error loading profile');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await API.put('/profile', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setAdmin(res.data);
      setEditMode(false);
    } catch (err) {
      alert('Update failed');
    }
  };

  if (!admin) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Profile Header */}
      <Card className="p-6 rounded-3xl shadow-lg bg-white flex flex-col md:flex-row items-center gap-6">
        <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
          <User className="w-10 h-10" />
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">{admin.name}</h2>
          <p className="text-gray-500 flex items-center gap-2">
            <Mail className="w-4 h-4" /> {admin.email}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-sm">
              <Users className="w-4 h-4 mr-1" /> {admin.studentsTaught} Students
            </Badge>
            {admin.subjects?.map((subject, idx) => (
              <Badge key={idx} className="bg-blue-100 text-blue-800 text-sm">
                <Book className="w-3 h-3 mr-1" /> {subject}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex md:flex-col gap-2">
          <Button onClick={() => setEditMode(!editMode)} variant={editMode ? 'ghost' : 'secondary'}>
            {editMode ? (
              <>
                <XCircle className="w-4 h-4 mr-1" /> Cancel
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-1" /> Edit
              </>
            )}
          </Button>
          {editMode && (
            <Button onClick={handleUpdate}>
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
          )}
        </div>
      </Card>

      {/* Editable Form Section */}
      <Card className="p-6 rounded-2xl shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!editMode}
          />
          <Input placeholder="Email" value={formData.email || ''} disabled />
          <Input
            placeholder="Students Taught"
            type="number"
            value={formData.studentsTaught || ''}
            onChange={(e) => setFormData({ ...formData, studentsTaught: e.target.value })}
            disabled={!editMode}
          />
          <Input
            placeholder="Subjects (comma-separated)"
            value={formData.subjects?.join(', ') || ''}
            onChange={(e) =>
              setFormData({ ...formData, subjects: e.target.value.split(',').map((s) => s.trim()) })
            }
            disabled={!editMode}
          />
        </div>

        <div className="mt-6 space-y-4">
          <Textarea
            placeholder="Bio"
            rows={3}
            value={formData.bio || ''}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!editMode}
          />
          <Textarea
            placeholder="Experience"
            rows={2}
            value={formData.experience || ''}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            disabled={!editMode}
          />
          <Textarea
            placeholder="Achievements (comma-separated)"
            rows={2}
            value={formData.achievements?.join(', ') || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                achievements: e.target.value.split(',').map((a) => a.trim()),
              })
            }
            disabled={!editMode}
          />
          <Textarea
            placeholder="Certifications (comma-separated)"
            rows={2}
            value={formData.certifications?.join(', ') || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                certifications: e.target.value.split(',').map((c) => c.trim()),
              })
            }
            disabled={!editMode}
          />
        </div>
      </Card>

      {/* Read-only Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-green-500 bg-green-50 rounded-2xl">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center">
            <Award className="w-4 h-4 mr-2" /> Achievements
          </h4>
          <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
            {admin.achievements?.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </Card>

        <Card className="p-6 border-l-4 border-yellow-500 bg-yellow-50 rounded-2xl">
          <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
            <GraduationCap className="w-4 h-4 mr-2" /> Certifications
          </h4>
          <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
            {admin.certifications?.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
